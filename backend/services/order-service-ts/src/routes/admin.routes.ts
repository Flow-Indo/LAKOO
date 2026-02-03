import { Router, type Router as ExpressRouter } from 'express';
import { param, query } from 'express-validator';
import { AdminController } from '../controllers/admin.controller';
import { gatewayOrInternalAuth, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/error-handler';
import { updateOrderStatusSchema, validate, validateRequest } from '../middleware/validation';

const router: ExpressRouter = Router();
const controller = new AdminController();

router.use(gatewayOrInternalAuth);
router.use(requireRole('admin'));

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: List orders (Admin)
 *     tags: [Admin]
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
 *       - in: query
 *         name: sellerId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *         description: Orders retrieved successfully
 */
router.get('/orders',
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
  asyncHandler(controller.getAllOrders)
);

/**
 * @swagger
 * /api/admin/orders/{id}:
 *   get:
 *     summary: Get order details (Admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/orders/:id',
  [param('id').isUUID().withMessage('Invalid order ID')],
  validateRequest,
  asyncHandler(controller.getOrderDetails)
);

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin)
 *     tags: [Admin]
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
 *               reason:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put('/orders/:id/status',
  [param('id').isUUID().withMessage('Invalid order ID')],
  validateRequest,
  validate(updateOrderStatusSchema),
  asyncHandler(controller.updateOrderStatus)
);

export default router;
