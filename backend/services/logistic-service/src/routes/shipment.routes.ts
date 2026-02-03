import { Router } from 'express';
import { param, query } from 'express-validator';
import { shipmentController } from '../controllers/shipment.controller';
import { authenticate } from '../middleware/auth';
import { validate, validateRequest, createShipmentSchema } from '../middleware/validation';

const router: import('express').Router = Router();

// =============================================================================
// Public Routes
// =============================================================================

// Track shipment by tracking number (no auth required)
/**
 * @swagger
 * /api/shipments/track/{trackingNumber}:
 *   get:
 *     summary: Track shipment by tracking number
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tracking information
 *       400:
 *         description: Validation error
 */
router.get(
  '/track/:trackingNumber',
  [param('trackingNumber').isString().notEmpty().withMessage('trackingNumber is required')],
  validateRequest,
  shipmentController.trackShipment
);

// =============================================================================
// Authenticated Routes
// =============================================================================

// Create shipment
/**
 * @swagger
 * /api/shipments:
 *   post:
 *     summary: Create a new shipment
 *     tags: [Shipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShipment'
 *     responses:
 *       201:
 *         description: Shipment created
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  authenticate,
  validate(createShipmentSchema),
  shipmentController.createShipment
);

// Get user's shipments
/**
 * @swagger
 * /api/shipments/user:
 *   get:
 *     summary: Get shipments for authenticated user
 *     tags: [Shipments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of shipments
 *       400:
 *         description: Validation error
 */
router.get(
  '/user',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }).toInt().withMessage('page must be an integer >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('limit must be an integer 1..100')
  ],
  validateRequest,
  shipmentController.getUserShipments
);

// Get shipment by order ID
/**
 * @swagger
 * /api/shipments/order/{orderId}:
 *   get:
 *     summary: Get shipment by order ID
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Shipment
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.get(
  '/order/:orderId',
  authenticate,
  [param('orderId').isUUID().withMessage('Invalid orderId')],
  validateRequest,
  shipmentController.getShipmentByOrderId
);

// Get shipment by ID
/**
 * @swagger
 * /api/shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Shipment
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.get(
  '/:id',
  authenticate,
  [param('id').isUUID().withMessage('Invalid shipment id')],
  validateRequest,
  shipmentController.getShipmentById
);

// Get tracking history
/**
 * @swagger
 * /api/shipments/{id}/tracking:
 *   get:
 *     summary: Get tracking history for a shipment
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tracking events
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.get(
  '/:id/tracking',
  authenticate,
  [param('id').isUUID().withMessage('Invalid shipment id')],
  validateRequest,
  shipmentController.getTrackingHistory
);

// Cancel shipment
/**
 * @swagger
 * /api/shipments/{id}/cancel:
 *   post:
 *     summary: Cancel a shipment
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Shipment cancelled
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.post(
  '/:id/cancel',
  authenticate,
  [param('id').isUUID().withMessage('Invalid shipment id')],
  validateRequest,
  shipmentController.cancelShipment
);

export default router;
