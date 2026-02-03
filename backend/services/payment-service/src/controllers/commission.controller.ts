import { Request, Response } from 'express';
import { CommissionService } from '../services/commission.service';
import { BadRequestError, NotFoundError, asyncHandler } from '../middleware/error-handler';
import { CommissionStatus } from '../generated/prisma';

const commissionService = new CommissionService();

/**
 * Commission Controller
 *
 * Handles HTTP requests for commission management
 */

/**
 * Record commission for an order
 * POST /api/commissions
 * @access Internal (called by order-service)
 */
export const recordCommission = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, orderNumber, sellerId, paymentId, orderAmount, commissionRate } = req.body as any;

  if (!orderId) throw new BadRequestError('orderId is required');
  if (!orderNumber) throw new BadRequestError('orderNumber is required');
  if (!sellerId) throw new BadRequestError('sellerId is required');
  if (orderAmount === undefined || orderAmount === null) throw new BadRequestError('orderAmount is required');

  const commission = await commissionService.recordCommission({
    orderId,
    orderNumber,
    sellerId,
    paymentId,
    orderAmount: parseFloat(String(orderAmount)),
    commissionRate: commissionRate ? parseFloat(String(commissionRate)) : undefined
  });

  res.status(201).json({
    success: true,
    data: commission
  });
});

/**
 * Mark order as completed (commission becomes collectible)
 * PUT /api/commissions/order/:orderId/complete
 * @access Internal (called by order-service)
 */
export const markOrderCompleted = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const { sellerId, completedAt } = req.body as any;

  if (!orderId) throw new BadRequestError('orderId is required');
  if (!sellerId) throw new BadRequestError('sellerId is required');

  const commission = await commissionService.markOrderCompleted({
    orderId,
    sellerId,
    completedAt: completedAt ? new Date(completedAt) : undefined
  });

  res.json({
    success: true,
    data: commission
  });
});

/**
 * Collect commissions for seller (during settlement)
 * POST /api/commissions/seller/:sellerId/collect
 * @access Internal (called by settlement job)
 */
export const collectCommissions = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId;
  const { settlementId } = req.body as any;

  if (!sellerId) throw new BadRequestError('sellerId is required');

  const result = await commissionService.collectCommissions({
    sellerId,
    settlementId
  });

  res.json({
    success: true,
    data: {
      commissions: result.commissions,
      totalAmount: result.totalAmount,
      count: result.commissions.length
    }
  });
});

/**
 * Waive commission for an order
 * PUT /api/commissions/order/:orderId/waive
 * @access Admin only
 */
export const waiveCommission = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const { sellerId, reason } = req.body as any;

  if (!orderId) throw new BadRequestError('orderId is required');
  if (!sellerId) throw new BadRequestError('sellerId is required');
  if (!reason) throw new BadRequestError('reason is required');

  const commission = await commissionService.waiveCommission(orderId, sellerId, reason);

  res.json({
    success: true,
    data: commission,
    message: 'Commission waived successfully'
  });
});

/**
 * Refund commission (when order is refunded)
 * PUT /api/commissions/order/:orderId/refund
 * @access Internal (called by refund service)
 */
export const refundCommission = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const { sellerId } = req.body as any;

  if (!orderId) throw new BadRequestError('orderId is required');
  if (!sellerId) throw new BadRequestError('sellerId is required');

  const commission = await commissionService.refundCommission(orderId, sellerId);

  res.json({
    success: true,
    data: commission,
    message: 'Commission refunded successfully'
  });
});

/**
 * Get commission by ID
 * GET /api/commissions/:id
 * @access Internal / Admin
 */
export const getCommissionById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) throw new BadRequestError('id is required');

  const commission = await commissionService.getById(id);

  if (!commission) {
    throw new NotFoundError('Commission not found');
  }

  res.json({
    success: true,
    data: commission
  });
});

/**
 * Get commission by ledger number
 * GET /api/commissions/ledger/:ledgerNumber
 * @access Internal / Admin
 */
export const getCommissionByLedgerNumber = asyncHandler(async (req: Request, res: Response) => {
  const ledgerNumber = req.params.ledgerNumber;
  if (!ledgerNumber) throw new BadRequestError('ledgerNumber is required');

  const commission = await commissionService.getByLedgerNumber(ledgerNumber);

  if (!commission) {
    throw new NotFoundError('Commission not found');
  }

  res.json({
    success: true,
    data: commission
  });
});

/**
 * Get commissions for a seller
 * GET /api/commissions/seller/:sellerId
 * @access Internal / Seller
 */
export const getSellerCommissions = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId;
  const { status, limit = 50, offset = 0 } = req.query;

  if (!sellerId) throw new BadRequestError('sellerId is required');

  const commissions = await commissionService.getBySellerId(sellerId, {
    status: status as CommissionStatus | undefined,
    limit: parseInt(limit as string),
    offset: parseInt(offset as string)
  });

  res.json({
    success: true,
    data: commissions,
    pagination: {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      count: commissions.length
    }
  });
});

/**
 * Get commissions for an order
 * GET /api/commissions/order/:orderId
 * @access Internal
 */
export const getOrderCommissions = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  if (!orderId) throw new BadRequestError('orderId is required');

  const commissions = await commissionService.getByOrderId(orderId);

  res.json({
    success: true,
    data: commissions
  });
});

/**
 * Get commission statistics for a seller
 * GET /api/commissions/seller/:sellerId/stats
 * @access Internal / Seller
 */
export const getSellerStats = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId;
  if (!sellerId) throw new BadRequestError('sellerId is required');

  const stats = await commissionService.getSellerStats(sellerId);

  res.json({
    success: true,
    data: stats
  });
});

/**
 * Calculate net payout after commission
 * POST /api/commissions/calculate-payout
 * @access Internal
 */
export const calculateNetPayout = asyncHandler(async (req: Request, res: Response) => {
  const { grossAmount, commissionAmount } = req.body as any;

  if (grossAmount === undefined || grossAmount === null) throw new BadRequestError('grossAmount is required');
  if (commissionAmount === undefined || commissionAmount === null) throw new BadRequestError('commissionAmount is required');

  const netPayout = commissionService.calculateNetPayout(
    parseFloat(String(grossAmount)),
    parseFloat(String(commissionAmount))
  );

  res.json({
    success: true,
    data: {
      grossAmount: parseFloat(String(grossAmount)),
      commissionAmount: parseFloat(String(commissionAmount)),
      netPayout
    }
  });
});
