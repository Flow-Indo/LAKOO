// services/order-service/src/routes/order.routes.ts

import { Router, type Router as ExpressRouter } from 'express';
import { param, query } from 'express-validator';
import { OrderController } from '../controllers/order.controller';
import { gatewayOrInternalAuth, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/error-handler';
import { createOrderSchema, updateOrderStatusSchema, updateShippingCostSchema, validate, validateRequest } from '../middleware/validation';

const router: ExpressRouter = Router();
const controller = new OrderController();

router.use(gatewayOrInternalAuth);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Checkout (creates order(s) split by seller + creates payment invoice(s))
 *     tags: [Orders]
 *     description: |
 *       - Prices are computed server-side from product-service.
 *       - If checkout contains multiple sellers, this endpoint creates multiple orders (one per seller, plus one for house-brand items).
 *       - Gateway calls derive userId from auth headers; internal calls must supply userId in the body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idempotencyKey, items, shippingAddress]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: Required only for internal service-to-service calls.
 *               idempotencyKey:
 *                 type: string
 *                 example: checkout-20260130-abc123
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                     variantId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *               shippingAddressId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional reference to address-service; order stores a snapshot regardless.
 *               shippingAddress:
 *                 type: object
 *                 required: [name, phone, province, city, address]
 *                 properties:
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   province:
 *                     type: string
 *                   city:
 *                     type: string
 *                   district:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   address:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *               shippingNotes:
 *                 type: string
 *               discountAmount:
 *                 type: number
 *                 minimum: 0
 *               paymentMethod:
 *                 type: string
 *                 enum: [bank_transfer, virtual_account, credit_card, ewallet_ovo, ewallet_gopay, ewallet_dana, qris]
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Order(s) created successfully
 *       400:
 *         description: Bad request
 */
router.post('/',
  validate(createOrderSchema),
  asyncHandler(controller.checkout)
);

// Group buying endpoints removed (Jan 2026 pivot).

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List orders
 *     tags: [Orders]
 *     description: Users see their own orders; admin/internal can query any userId and filter by sellerId.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, awaiting_payment, paid, confirmed, processing, ready_to_ship, shipped, in_transit, out_for_delivery, delivered, completed, cancelled, refunded, partially_refunded]
 *       - in: query
 *         name: orderSource
 *         schema:
 *           type: string
 *           enum: [brand, seller, live_commerce]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Admin/internal only.
 *       - in: query
 *         name: sellerId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by orderNumber or recipient/phone.
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
 *         description: List of orders with pagination
 */
router.get('/',
  [
    query('status').optional().isString(),
    query('orderSource').optional().isString(),
    query('userId').optional().isUUID(),
    query('sellerId').optional().isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  asyncHandler(controller.getOrders)
);

// Deprecated endpoints removed.

/**
 * @swagger
 * /api/orders/number/{orderNumber}:
 *   get:
 *     summary: Get order by order number
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *         example: ORD-20251005-A7B3C
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/number/:orderNumber', asyncHandler(controller.getOrderByNumber));

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Order details with items and snapshots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Order not found
 */
router.get('/:id', [
  param('id').isUUID()
], validateRequest, asyncHandler(controller.getOrder));

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
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
 *             type: object
 *             required: [newStatus]
 *             properties:
 *               newStatus:
 *                 type: string
 *                 enum: [pending, awaiting_payment, paid, confirmed, processing, ready_to_ship, shipped, in_transit, out_for_delivery, delivered, completed, cancelled, refunded, partially_refunded]
 *                 example: paid
 *               reason:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Invalid status transition
 */
router.put('/:id/status',
  requireRole('admin', 'internal'),
  [param('id').isUUID()],
  validateRequest,
  validate(updateOrderStatusSchema),
  asyncHandler(controller.updateOrderStatus)
);

/**
 * @swagger
 * /api/orders/{id}/shipping-cost:
 *   put:
 *     summary: Update shipping cost and tax
 *     tags: [Orders]
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
 *             type: object
 *             required: [shippingCost]
 *             properties:
 *               shippingCost:
 *                 type: number
 *                 minimum: 0
 *                 example: 15000
 *               taxAmount:
 *                 type: number
 *                 minimum: 0
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Shipping cost updated
 *       400:
 *         description: Bad request
 */
router.put('/:id/shipping-cost',
  requireRole('admin', 'internal'),
  [param('id').isUUID()],
  validateRequest,
  validate(updateShippingCostSchema),
  asyncHandler(controller.updateShippingCost)
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   post:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Cannot cancel order in current status
 */
router.post('/:id/cancel', [
  param('id').isUUID()
], validateRequest, asyncHandler(controller.cancelOrder));

export default router;
