import { Router } from 'express';
import { param, query } from 'express-validator';
import { adminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  validate,
  validateRequest,
  updateShipmentStatusSchema,
  updateShipmentSchema,
  createTrackingEventSchema,
  markDeliveredSchema,
  markFailedSchema,
  createCourierSchema,
  updateCourierSchema,
  toggleCourierSchema,
  createCourierServiceSchema,
  createWarehouseSchema,
  updateWarehouseSchema
} from '../middleware/validation';

const router: import('express').Router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// =============================================================================
// Shipment Routes
// =============================================================================

/**
 * @swagger
 * /api/admin/shipments:
 *   get:
 *     summary: Get all shipments (admin)
 *     tags: [Admin - Shipments]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, booked, awaiting_pickup, picked_up, in_transit, at_destination_hub, out_for_delivery, delivered, failed, returned, cancelled]
 *     responses:
 *       200:
 *         description: List of shipments
 *       400:
 *         description: Validation error
 */
router.get(
  '/shipments',
  [
    query('page').optional().isInt({ min: 1 }).toInt().withMessage('page must be an integer >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('limit must be an integer 1..100'),
    query('status')
      .optional()
      .isIn([
        'pending',
        'booked',
        'awaiting_pickup',
        'picked_up',
        'in_transit',
        'at_destination_hub',
        'out_for_delivery',
        'delivered',
        'failed',
        'returned',
        'cancelled'
      ])
      .withMessage('Invalid status')
  ],
  validateRequest,
  adminController.getAllShipments
);

/**
 * @swagger
 * /api/admin/shipments/{id}:
 *   put:
 *     summary: Update shipment (admin)
 *     tags: [Admin - Shipments]
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
 *             $ref: '#/components/schemas/UpdateShipment'
 *     responses:
 *       200:
 *         description: Shipment updated
 *       400:
 *         description: Validation error
 */
router.put(
  '/shipments/:id',
  [param('id').isUUID().withMessage('Invalid shipment id')],
  validateRequest,
  validate(updateShipmentSchema),
  adminController.updateShipment
);

/**
 * @swagger
 * /api/admin/shipments/{id}/status:
 *   put:
 *     summary: Update shipment status (admin)
 *     tags: [Admin - Shipments]
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
  adminController.updateShipmentStatus
);

/**
 * @swagger
 * /api/admin/shipments/{id}/tracking:
 *   post:
 *     summary: Add manual tracking event (admin)
 *     tags: [Admin - Shipments]
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
 *             $ref: '#/components/schemas/CreateTrackingEvent'
 *     responses:
 *       201:
 *         description: Tracking event created
 *       400:
 *         description: Validation error
 */
router.post(
  '/shipments/:id/tracking',
  [param('id').isUUID().withMessage('Invalid shipment id')],
  validateRequest,
  validate(createTrackingEventSchema),
  adminController.addTrackingEvent
);

/**
 * @swagger
 * /api/admin/shipments/{id}/delivered:
 *   post:
 *     summary: Mark shipment as delivered (admin)
 *     tags: [Admin - Shipments]
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
 *             $ref: '#/components/schemas/MarkDelivered'
 *     responses:
 *       200:
 *         description: Shipment updated
 *       400:
 *         description: Validation error
 */
router.post(
  '/shipments/:id/delivered',
  [param('id').isUUID().withMessage('Invalid shipment id')],
  validateRequest,
  validate(markDeliveredSchema),
  adminController.markDelivered
);

/**
 * @swagger
 * /api/admin/shipments/{id}/failed:
 *   post:
 *     summary: Mark shipment as failed (admin)
 *     tags: [Admin - Shipments]
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
 *             $ref: '#/components/schemas/MarkFailed'
 *     responses:
 *       200:
 *         description: Shipment updated
 *       400:
 *         description: Validation error
 */
router.post(
  '/shipments/:id/failed',
  [param('id').isUUID().withMessage('Invalid shipment id')],
  validateRequest,
  validate(markFailedSchema),
  adminController.markFailed
);

/**
 * @swagger
 * /api/admin/shipments/stats:
 *   get:
 *     summary: Get shipment statistics (admin)
 *     tags: [Admin - Shipments]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Stats
 */
router.get(
  '/shipments/stats',
  [
    query('startDate').optional().isISO8601().withMessage('startDate must be ISO8601 date-time'),
    query('endDate').optional().isISO8601().withMessage('endDate must be ISO8601 date-time')
  ],
  validateRequest,
  adminController.getShipmentStats
);

// =============================================================================
// Courier Routes
// =============================================================================

/**
 * @swagger
 * /api/admin/couriers:
 *   get:
 *     summary: Get all couriers (admin)
 *     tags: [Admin - Couriers]
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: List of couriers
 */
router.get(
  '/couriers',
  [query('includeInactive').optional().isIn(['true', 'false']).withMessage('includeInactive must be true or false')],
  validateRequest,
  adminController.getAllCouriers
);

/**
 * @swagger
 * /api/admin/couriers:
 *   post:
 *     summary: Create courier integration (admin)
 *     tags: [Admin - Couriers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourier'
 *     responses:
 *       201:
 *         description: Courier created
 *       400:
 *         description: Validation error
 */
router.post('/couriers', validate(createCourierSchema), adminController.createCourier);

/**
 * @swagger
 * /api/admin/couriers/{id}:
 *   put:
 *     summary: Update courier integration (admin)
 *     tags: [Admin - Couriers]
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
 *             $ref: '#/components/schemas/UpdateCourier'
 *     responses:
 *       200:
 *         description: Courier updated
 *       400:
 *         description: Validation error
 */
router.put(
  '/couriers/:id',
  [param('id').isUUID().withMessage('Invalid courier id')],
  validateRequest,
  validate(updateCourierSchema),
  adminController.updateCourier
);

/**
 * @swagger
 * /api/admin/couriers/{id}/toggle:
 *   post:
 *     summary: Toggle courier active status (admin)
 *     tags: [Admin - Couriers]
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
 *             $ref: '#/components/schemas/ToggleCourier'
 *     responses:
 *       200:
 *         description: Courier updated
 *       400:
 *         description: Validation error
 */
router.post(
  '/couriers/:id/toggle',
  [param('id').isUUID().withMessage('Invalid courier id')],
  validateRequest,
  validate(toggleCourierSchema),
  adminController.toggleCourier
);

/**
 * @swagger
 * /api/admin/couriers/{id}/services:
 *   post:
 *     summary: Add courier service (admin)
 *     tags: [Admin - Couriers]
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
 *             $ref: '#/components/schemas/CreateCourierService'
 *     responses:
 *       201:
 *         description: Courier service created
 *       400:
 *         description: Validation error
 */
router.post(
  '/couriers/:id/services',
  [param('id').isUUID().withMessage('Invalid courier id')],
  validateRequest,
  validate(createCourierServiceSchema),
  adminController.addCourierService
);

// =============================================================================
// Warehouse Routes
// =============================================================================

/**
 * @swagger
 * /api/admin/warehouses:
 *   get:
 *     summary: Get all warehouses (admin)
 *     tags: [Admin - Warehouses]
 *     responses:
 *       200:
 *         description: List of warehouses
 */
router.get('/warehouses', adminController.getAllWarehouses);

/**
 * @swagger
 * /api/admin/warehouses:
 *   post:
 *     summary: Create warehouse (admin)
 *     tags: [Admin - Warehouses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWarehouse'
 *     responses:
 *       201:
 *         description: Warehouse created
 *       400:
 *         description: Validation error
 */
router.post('/warehouses', validate(createWarehouseSchema), adminController.createWarehouse);

/**
 * @swagger
 * /api/admin/warehouses/{id}:
 *   put:
 *     summary: Update warehouse (admin)
 *     tags: [Admin - Warehouses]
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
 *             $ref: '#/components/schemas/UpdateWarehouse'
 *     responses:
 *       200:
 *         description: Warehouse updated
 *       400:
 *         description: Validation error
 */
router.put(
  '/warehouses/:id',
  [param('id').isUUID().withMessage('Invalid warehouse id')],
  validateRequest,
  validate(updateWarehouseSchema),
  adminController.updateWarehouse
);

/**
 * @swagger
 * /api/admin/warehouses/{id}/default:
 *   post:
 *     summary: Set warehouse as default (admin)
 *     tags: [Admin - Warehouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Warehouse updated
 *       400:
 *         description: Validation error
 */
router.post(
  '/warehouses/:id/default',
  [param('id').isUUID().withMessage('Invalid warehouse id')],
  validateRequest,
  adminController.setDefaultWarehouse
);

export default router;
