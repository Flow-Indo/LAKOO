import { Request, Response } from 'express';
import { TransactionLedgerService } from '../services/transaction-ledger.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { ForbiddenError, UnauthorizedError, BadRequestError, NotFoundError, asyncHandler } from '../middleware/error-handler';
import { prisma } from '../lib/prisma';

export class TransactionController {
  private transactionService: TransactionLedgerService;

  constructor() {
    this.transactionService = new TransactionLedgerService();
  }

  /**
   * Get transaction history for an order
   * GET /api/transactions/order/:orderId
   */
  getOrderTransactionHistory = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { orderId } = req.params;
    if (!orderId) {
      throw new BadRequestError('orderId is required');
    }

    // Authorization: user can only view their own order transactions.
    if (authReq.user?.role !== 'internal' && authReq.user?.role !== 'admin') {
      if (!authReq.user?.id) throw new UnauthorizedError('Missing authenticated user');

      const anyPayment = await prisma.payment.findFirst({
        where: { orderId },
        select: { userId: true }
      });

      if (anyPayment && anyPayment.userId !== authReq.user.id) {
        throw new ForbiddenError('Cannot access transactions for another user');
      }
    }

    const transactions = await this.transactionService.getOrderTransactionHistory(orderId);

    res.json({
      success: true,
      data: transactions
    });
  });

  /**
   * Get transaction history for a payment
   * GET /api/transactions/payment/:paymentId
   */
  getPaymentTransactionHistory = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { paymentId } = req.params;
    if (!paymentId) {
      throw new BadRequestError('paymentId is required');
    }

    // Authorization: user can only view their own payment transactions.
    if (authReq.user?.role !== 'internal' && authReq.user?.role !== 'admin') {
      if (!authReq.user?.id) throw new UnauthorizedError('Missing authenticated user');

      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        select: { userId: true }
      });

      if (payment && payment.userId !== authReq.user.id) {
        throw new ForbiddenError('Cannot access transactions for another user');
      }
    }

    const transactions = await this.transactionService.getPaymentTransactionHistory(paymentId);

    res.json({
      success: true,
      data: transactions
    });
  });

  /**
   * Get transaction summary for a period
   * GET /api/transactions/summary
   */
  getTransactionSummary = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new BadRequestError('startDate and endDate are required');
    }

    const summary = await this.transactionService.getTransactionSummary(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json({
      success: true,
      data: summary
    });
  });

  /**
   * Get recent transactions
   * GET /api/transactions/recent
   */
  getRecentTransactions = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const transactions = await this.transactionService.getRecentTransactions(limit, offset);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        limit,
        offset
      }
    });
  });

  /**
   * Find transaction by code
   * GET /api/transactions/:transactionCode
   */
  findByCode = asyncHandler(async (req: Request, res: Response) => {
    const { transactionCode } = req.params;
    if (!transactionCode) {
      throw new BadRequestError('transactionCode is required');
    }

    const transaction = await this.transactionService.findByCode(transactionCode);

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    res.json({
      success: true,
      data: transaction
    });
  });
}
