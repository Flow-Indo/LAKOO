import { Router } from 'express';
import { param } from 'express-validator';
import { shipmentController } from '../controllers/shipment.controller';
import { rateController } from '../controllers/rate.controller';
import { requireInternalAuth } from '../middleware/auth';
import {
  validate,
  validateRequest,
  createShipmentInternalSchema,
  getRatesSchema,
  updateShipmentStatusSchema,
  bookShipmentSchema
} from '../middleware/validation';

const router: import('express').Router = Router();

// All internal routes require internal API key
router.use(requireInternalAuth);

// =============================================================================
// Shipment Routes (for Order Service)
// =============================================================================

// Create shipment for an order
/**
 * @swagger
 * /api/internal/shipments:
 *   post:
 *     summary: Create shipment (internal service-to-service)
 *     tags: [Internal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShipmentInternal'
 *     responses:
 *       201:
 *         description: Shipment created
 *       400:
 *         description: Validation error
 */
router.post('/shipments', validate(createShipmentInternalSchema), shipmentController.createShipmentInternal);

// Book shipment with courier
/**
 * @swagger
 * /api/internal/shipments/{id}/book:
 *   post:
 *     summary: Book shipment with courier (internal)
 *     tags: [Internal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookShipment'
 *     responses:
 *       200:
 *         description: Shipment booked
 *       400:
 *         description: Validation error
 */
router.post(
  '/shipments/:id/book',
  [param('id').isUUID().withMessage('Invalid shipment id')],
  validateRequest,
  validate(bookShipmentSchema),
  shipmentController.bookShipmentInternal
);

// Update shipment status
/**
 * @swagger
 * /api/internal/shipments/{id}/status:
 *   put:
 *     summary: Update shipment status (internal)
 *     tags: [Internal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShipmentStatus'
 *     responses:
 *       200:
 *         description: Shipment updated
 *       400:
 *         description: Validation error
 */
router.put(
  '/shipments/:id/status',
  [param('id').isUUID().withMessage('Invalid shipment id')],
  validateRequest,
  validate(updateShipmentStatusSchema),
  shipmentController.updateStatusInternal
);

// Get shipment by order ID
/**
 * @swagger
 * /api/internal/shipments/order/{orderId}:
 *   get:
 *     summary: Get shipment by order ID (internal)
 *     tags: [Internal]
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
  '/shipments/order/:orderId',
  [param('orderId').isUUID().withMessage('Invalid orderId')],
  validateRequest,
  shipmentController.getByOrderIdInternal
);

// =============================================================================
// Rate Routes (for Checkout Service)
// =============================================================================

// Get shipping rates
/**
 * @swagger
 * /api/internal/rates:
 *   post:
 *     summary: Get shipping rates (internal service-to-service)
 *     tags: [Internal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetRatesRequest'
 *     responses:
 *       200:
 *         description: List of shipping rates
 *       400:
 *         description: Validation error
 */
router.post('/rates', validate(getRatesSchema), rateController.getShippingRatesInternal);

export default router;
