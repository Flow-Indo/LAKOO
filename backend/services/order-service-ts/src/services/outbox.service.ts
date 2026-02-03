import { Prisma, ServiceOutbox } from '../generated/prisma';

export class OutboxService {
  async orderCreated(order: { id: string; orderNumber: string; userId: string; sellerId: string | null }, tx: Prisma.TransactionClient) {
    return tx.serviceOutbox.create({
      data: {
        aggregateType: 'Order',
        aggregateId: order.id,
        eventType: 'order.created',
        payload: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: order.userId,
          sellerId: order.sellerId
        }
      }
    });
  }

  async orderStatusChanged(
    data: { orderId: string; orderNumber: string; fromStatus: string | null; toStatus: string; reason?: string; notes?: string },
    tx: Prisma.TransactionClient
  ): Promise<ServiceOutbox> {
    return tx.serviceOutbox.create({
      data: {
        aggregateType: 'Order',
        aggregateId: data.orderId,
        eventType: 'order.status_changed',
        payload: data
      }
    });
  }
}

export const outboxService = new OutboxService();

