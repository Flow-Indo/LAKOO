import { Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthenticatedRequest } from '../middleware/auth';

export class AdminController {
  private service: OrderService;

  constructor() {
    this.service = new OrderService();
  }

  getAllOrders = async (req: AuthenticatedRequest, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await this.service.getOrders({
      userId: req.query.userId as string | undefined,
      sellerId: req.query.sellerId as string | undefined,
      orderSource: req.query.orderSource as any,
      status: req.query.status as any,
      search: req.query.search as string | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      page,
      limit
    });

    res.json({ success: true, ...result });
  };

  getOrderDetails = async (req: AuthenticatedRequest, res: Response) => {
    const order = await this.service.getOrder(req.params.id);
    res.json({ success: true, data: order });
  };

  updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
    const updated = await this.service.updateOrderStatus({
      orderId: req.params.id,
      newStatus: req.body.newStatus,
      reason: req.body.reason,
      notes: req.body.notes,
      metadata: req.body.metadata,
      changedBy: req.user?.id,
      changedByType: 'admin'
    });

    res.json({ success: true, message: 'Order status updated', data: updated });
  };
}
