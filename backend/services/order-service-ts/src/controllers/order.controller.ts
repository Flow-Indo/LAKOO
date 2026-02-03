import { Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { ForbiddenError } from '../middleware/error-handler';

export class OrderController {
  private service: OrderService;

  constructor() {
    this.service = new OrderService();
  }

  checkout = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.role === 'internal' ? (req.body.userId as string | undefined) : req.user?.id;
    const result = await this.service.checkout({
      ...req.body,
      userId
    });
    res.status(result?.isExisting ? 200 : 201).json({
      success: true,
      data: result
    });
  };

  getOrder = async (req: AuthenticatedRequest, res: Response) => {
    const order = await this.service.getOrder(req.params.id);

    if (req.user?.role !== 'internal' && req.user?.role !== 'admin') {
      if (!req.user?.id || order.userId !== req.user.id) {
        throw new ForbiddenError('Insufficient permissions');
      }
    }

    res.json({ success: true, data: order });
  };

  getOrderByNumber = async (req: AuthenticatedRequest, res: Response) => {
    const order = await this.service.getOrderByNumber(req.params.orderNumber);

    if (req.user?.role !== 'internal' && req.user?.role !== 'admin') {
      if (!req.user?.id || order.userId !== req.user.id) {
        throw new ForbiddenError('Insufficient permissions');
      }
    }

    res.json({ success: true, data: order });
  };

  getOrders = async (req: AuthenticatedRequest, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const isAdminOrInternal = req.user?.role === 'admin' || req.user?.role === 'internal';

    const filters = {
      userId: isAdminOrInternal ? (req.query.userId as string | undefined) : req.user?.id,
      sellerId: req.query.sellerId as string | undefined,
      orderSource: req.query.orderSource as any,
      status: req.query.status as any,
      search: req.query.search as string | undefined,
      page,
      limit,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
    };

    const result = await this.service.getOrders(filters);
    res.json({ success: true, ...result });
  };

  updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
    const isInternal = req.user?.role === 'internal';
    const updated = await this.service.updateOrderStatus({
      orderId: req.params.id,
      ...req.body,
      // changedBy is stored as UUID in most DBs; internal/system callers should leave it null.
      changedBy: isInternal ? undefined : req.user?.id,
      changedByType: isInternal ? 'service' : (req.user?.role as any) || 'system'
    });
    res.json({ success: true, message: 'Order status updated', data: updated });
  };

  updateShippingCost = async (req: AuthenticatedRequest, res: Response) => {
    const updated = await this.service.updateShippingCost(req.params.id, req.body.shippingCost, req.body.taxAmount);
    res.json({ success: true, message: 'Shipping cost updated', data: updated });
  };

  cancelOrder = async (req: AuthenticatedRequest, res: Response) => {
    const order = await this.service.getOrder(req.params.id);
    if (req.user?.role !== 'admin' && req.user?.role !== 'internal') {
      if (!req.user?.id || order.userId !== req.user.id) {
        throw new ForbiddenError('Insufficient permissions');
      }
    }

    const isInternal = req.user?.role === 'internal';
    const updated = await this.service.updateOrderStatus({
      orderId: req.params.id,
      newStatus: 'cancelled',
      reason: req.body?.reason || 'customer_cancelled',
      notes: req.body?.notes,
      changedBy: isInternal ? undefined : req.user?.id,
      changedByType: isInternal ? 'service' : 'customer'
    });

    res.json({ success: true, message: 'Order cancelled', data: updated });
  };
}
