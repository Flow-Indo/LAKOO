import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { RefundService } from '../services/refund.service';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  asyncHandler
} from '../middleware/error-handler';

export class PaymentController {
  private paymentService: PaymentService;
  private refundService: RefundService;

  constructor() {
    this.paymentService = new PaymentService();
    this.refundService = new RefundService();
  }

  /**
   * Create a new payment for an order
   */
  createPayment = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const role = authReq.user?.role;
    const authUserId = authReq.user?.id;

    const input = { ...(req.body as any) };

    // Gateway-originated requests must not be able to create payments for arbitrary users.
    if (role !== 'internal') {
      if (!authUserId) {
        throw new UnauthorizedError('Missing authenticated user');
      }
      if (input.userId && input.userId !== authUserId) {
        throw new ForbiddenError('Cannot create payment for another user');
      }
      input.userId = authUserId;
    }

    const result = await this.paymentService.createPayment(input);
    res.status(result.isExisting ? 200 : 201).json({
      success: true,
      data: result
    });
  });

  /**
   * Get payment by order ID
   */
  getPaymentByOrder = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const orderId = req.params.orderId;
    if (!orderId) {
      throw new BadRequestError('orderId is required');
    }
    const payment = await this.paymentService.getPaymentByOrderId(orderId);
    if (!payment) {
      throw new NotFoundError('Payment not found for this order');
    }

    // Authorization: users can only view their own payments; admins/internal can view any.
    if (authReq.user?.role !== 'internal' && authReq.user?.role !== 'admin') {
      if (!authReq.user?.id) throw new UnauthorizedError('Missing authenticated user');
      if (payment.userId !== authReq.user.id) {
        throw new ForbiddenError('Cannot access payment for another user');
      }
    }

    res.json({
      success: true,
      data: payment
    });
  });

  /**
   * Get payment by ID
   */
  getPaymentById = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id;
    if (!id) {
      throw new BadRequestError('id is required');
    }
    const payment = await this.paymentService.getPaymentById(id);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Authorization: users can only view their own payments; admins/internal can view any.
    if (authReq.user?.role !== 'internal' && authReq.user?.role !== 'admin') {
      if (!authReq.user?.id) throw new UnauthorizedError('Missing authenticated user');
      if (payment.userId !== authReq.user.id) {
        throw new ForbiddenError('Cannot access payment for another user');
      }
    }

    res.json({
      success: true,
      data: payment
    });
  });

  /**
   * Get payments for a user
   */
  getPaymentsByUser = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { limit, offset } = req.query;
    const userId = req.params.userId;
    if (!userId) {
      throw new BadRequestError('userId is required');
    }

    // Authorization: non-admin/non-internal can only query their own userId.
    if (authReq.user?.role !== 'internal' && authReq.user?.role !== 'admin') {
      if (!authReq.user?.id) throw new UnauthorizedError('Missing authenticated user');
      if (userId !== authReq.user.id) {
        throw new ForbiddenError('Cannot access payments for another user');
      }
    }

    const payments = await this.paymentService.getPaymentsByUserId(
      userId,
      {
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      }
    );
    res.json({
      success: true,
      data: payments
    });
  });

  /**
   * Get payments eligible for settlement (admin)
   */
  getEligibleForSettlement = asyncHandler(async (req: Request, res: Response) => {
    const { periodStart, periodEnd } = req.body;
    if (!periodStart || !periodEnd) {
      throw new BadRequestError('periodStart and periodEnd are required');
    }
    const payments = await this.paymentService.findEligibleForSettlement(
      new Date(periodStart),
      new Date(periodEnd)
    );
    res.json({
      success: true,
      data: payments
    });
  });

  /**
   * Get payment statistics (admin)
   */
  getPaymentStats = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      throw new BadRequestError('startDate and endDate are required');
    }
    const stats = await this.paymentService.getPaymentStats(
      new Date(startDate),
      new Date(endDate)
    );
    res.json({
      success: true,
      data: stats
    });
  });

  /**
   * Create a refund for a payment
   */
  createRefund = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const role = authReq.user?.role;
    const authUserId = authReq.user?.id;

    const input = { ...(req.body as any) };

    // Gateway-originated requests must not be able to request refunds for arbitrary users.
    if (role !== 'internal') {
      if (!authUserId) {
        throw new UnauthorizedError('Missing authenticated user');
      }
      if (input.userId && input.userId !== authUserId) {
        throw new ForbiddenError('Cannot request refund for another user');
      }
      input.userId = authUserId;
    }

    const refund = await this.refundService.createRefund(input);
    res.status(201).json({
      success: true,
      data: refund
    });
  });

  /**
   * Get refund by ID
   */
  getRefundById = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id;
    if (!id) {
      throw new BadRequestError('id is required');
    }
    const refund = await this.refundService.getRefundById(id);
    if (!refund) {
      throw new NotFoundError('Refund not found');
    }

    if (authReq.user?.role !== 'internal' && authReq.user?.role !== 'admin') {
      if (!authReq.user?.id) throw new UnauthorizedError('Missing authenticated user');
      if (refund.userId !== authReq.user.id) {
        throw new ForbiddenError('Cannot access refund for another user');
      }
    }

    res.json({
      success: true,
      data: refund
    });
  });

  /**
   * Get refunds for an order
   */
  getRefundsByOrder = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const orderId = req.params.orderId;
    if (!orderId) {
      throw new BadRequestError('orderId is required');
    }
    const refunds = await this.refundService.getRefundsByOrderId(orderId);

    if (authReq.user?.role !== 'internal' && authReq.user?.role !== 'admin') {
      if (!authReq.user?.id) throw new UnauthorizedError('Missing authenticated user');
      const anyOtherUser = refunds.some(r => r.userId !== authReq.user!.id);
      if (anyOtherUser) {
        throw new ForbiddenError('Cannot access refunds for another user');
      }
    }

    res.json({
      success: true,
      data: refunds
    });
  });
}
