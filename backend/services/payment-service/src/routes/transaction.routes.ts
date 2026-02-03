import { Router, type Router as ExpressRouter } from 'express';
import { param, query } from 'express-validator';
import { TransactionController } from '../controllers/transaction.controller';
import { gatewayOrInternalAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router: ExpressRouter = Router();
const transactionController = new TransactionController();

// All transaction routes require authentication
router.use(gatewayOrInternalAuth);

/**
 * @swagger
 * /api/transactions/order/{orderId}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction history for an order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Transaction history retrieved
 */
router.get('/order/:orderId',
  [param('orderId').isUUID().withMessage('orderId must be a valid UUID')],
  validateRequest,
  transactionController.getOrderTransactionHistory
);

/**
 * @swagger
 * /api/transactions/payment/{paymentId}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction history for a payment
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Transaction history retrieved
 */
router.get('/payment/:paymentId',
  [param('paymentId').isUUID().withMessage('paymentId must be a valid UUID')],
  validateRequest,
  transactionController.getPaymentTransactionHistory
);

/**
 * @swagger
 * /api/transactions/summary:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction summary for a period
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 */
router.get('/summary',
  requireRole('admin', 'internal'),
  [
    query('startDate').isISO8601().withMessage('startDate is required and must be ISO8601'),
    query('endDate').isISO8601().withMessage('endDate is required and must be ISO8601')
  ],
  validateRequest,
  transactionController.getTransactionSummary
);

/**
 * @swagger
 * /api/transactions/recent:
 *   get:
 *     tags: [Transactions]
 *     summary: Get recent transactions
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 */
router.get('/recent',
  requireRole('admin', 'internal'),
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1-100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('offset must be >= 0')
  ],
  validateRequest,
  transactionController.getRecentTransactions
);

/**
 * @swagger
 * /api/transactions/{transactionCode}:
 *   get:
 *     tags: [Transactions]
 *     summary: Find transaction by code
 *     parameters:
 *       - in: path
 *         name: transactionCode
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:transactionCode',
  requireRole('admin', 'internal'),
  [param('transactionCode').isString().notEmpty().withMessage('transactionCode is required')],
  validateRequest,
  transactionController.findByCode
);

export default router;
