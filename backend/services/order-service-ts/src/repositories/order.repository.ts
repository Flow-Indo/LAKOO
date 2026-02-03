import { Prisma } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { PaginatedResponse, OrderFilters, UpdateOrderStatusDTO } from '../types';

export class OrderRepository {
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    });
  }

  async findByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true
      }
    });
  }

  async findAll(filters: OrderFilters): Promise<PaginatedResponse<any>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      deletedAt: null
    };

    if (filters.userId) where.userId = filters.userId;
    if (filters.sellerId) where.sellerId = filters.sellerId;
    if (filters.orderSource) where.orderSource = filters.orderSource as any;
    if (filters.status) where.status = filters.status as any;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) (where.createdAt as any).gte = filters.startDate;
      if (filters.endDate) (where.createdAt as any).lte = filters.endDate;
    }

    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { shippingRecipient: { contains: filters.search, mode: 'insensitive' } },
        { shippingPhone: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [total, data] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      })
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateStatus(data: UpdateOrderStatusDTO, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;

    const order = await client.order.findUnique({ where: { id: data.orderId } });
    if (!order) {
      return null;
    }

    const updated = await client.order.update({
      where: { id: data.orderId },
      data: {
        status: data.newStatus as any,
        paidAt: data.newStatus === 'paid' ? new Date() : undefined,
        cancelledAt: data.newStatus === 'cancelled' ? new Date() : undefined,
        deliveredAt: data.newStatus === 'delivered' ? new Date() : undefined,
        completedAt: data.newStatus === 'completed' ? new Date() : undefined,
        updatedAt: new Date()
      },
      include: { items: true }
    });

    await client.orderStatusHistory.create({
      data: {
        orderId: data.orderId,
        fromStatus: order.status as any,
        toStatus: data.newStatus as any,
        reason: data.reason ?? null,
        notes: data.notes ?? null,
        metadata: data.metadata ?? undefined,
        changedBy: data.changedBy ?? null,
        changedByType: data.changedByType ?? null
      }
    }).catch((err) => {
      // Some legacy DBs don't have order_status_history yet; don't block status updates in development.
      if (process.env.NODE_ENV === 'development') {
        console.warn('orderStatusHistory write skipped (development mode):', err?.message || err);
        return null;
      }
      throw err;
    });

    return updated;
  }

  async updateShippingCost(orderId: string, shippingCost: number, taxAmount: number = 0) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return null;

    const newTotal = Number(order.subtotal) + shippingCost + taxAmount - Number(order.discountAmount);

    return prisma.order.update({
      where: { id: orderId },
      data: {
        shippingCost,
        taxAmount,
        totalAmount: newTotal,
        updatedAt: new Date()
      }
    });
  }
}
