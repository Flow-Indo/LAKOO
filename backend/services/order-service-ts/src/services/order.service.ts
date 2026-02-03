import { OrderRepository } from '../repositories/order.repository';
import { OrderUtils } from '../utils/order.utils';
import { CheckoutOrderDTO, OrderFilters, OrderStatus, PaginatedResponse, UpdateOrderStatusDTO } from '../types';
import { prisma } from '../lib/prisma';
import { outboxService } from './outbox.service';
import { paymentClient } from '../clients/payment.client';
import { cartClient } from '../clients/cart.client';
import { authClient, type AuthUser } from '../clients/auth.client';
import { BadRequestError, NotFoundError } from '../middleware/error-handler';

export class OrderService {
  private repository: OrderRepository;
  private utils: OrderUtils;

  constructor() {
    this.repository = new OrderRepository();
    this.utils = new OrderUtils();
  }

  private async fetchUser(userId: string): Promise<AuthUser> {
    return authClient.fetchUser(userId);
  }

  private computeDiscountAllocation(subtotals: number[], totalDiscount: number): number[] {
    if (totalDiscount <= 0) return subtotals.map(() => 0);
    const totalSubtotal = subtotals.reduce((sum, s) => sum + s, 0);
    if (totalSubtotal <= 0) return subtotals.map(() => 0);

    const allocations = subtotals.map((s) => Math.floor((s / totalSubtotal) * totalDiscount));
    const allocated = allocations.reduce((sum, a) => sum + a, 0);
    const remainder = totalDiscount - allocated;
    if (remainder > 0) {
      allocations[allocations.length - 1] = (allocations[allocations.length - 1] || 0) + remainder;
    }
    return allocations;
  }

  async checkout(data: CheckoutOrderDTO): Promise<any> {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestError('Checkout must have at least one item');
    }

    if (!data.shippingAddress?.name || !data.shippingAddress?.address || !data.shippingAddress?.city || !data.shippingAddress?.province) {
      throw new BadRequestError('Complete shipping address required');
    }

    if (!data.userId) {
      throw new BadRequestError('userId is required');
    }

    const checkoutKey = data.idempotencyKey;
    if (!checkoutKey) {
      throw new BadRequestError('idempotencyKey is required');
    }

    // Idempotency: allow safe retries (same as payment-service pattern).
    // If orders already exist for this checkoutKey, return them and re-use payment-service idempotency keys.
    const existingOrders = await prisma.order.findMany({
      where: {
        userId: data.userId,
        idempotencyKey: { startsWith: `${checkoutKey}:` }
      },
      include: { items: true },
      orderBy: { idempotencyKey: 'asc' }
    });

    if (existingOrders.length > 0) {
      const payments: Array<{ orderId: string; orderNumber: string; [key: string]: any }> = [];
      const failedPayments: Array<{ orderId: string; orderNumber: string; error: any }> = [];

      for (const order of existingOrders) {
        const key = order.idempotencyKey || '';
        const idxStr = key.split(':').pop() || '0';
        const idx = Number.parseInt(idxStr, 10);

        try {
          const payment = await paymentClient.createPayment({
            orderId: order.id,
            userId: data.userId,
            amount: Number(order.totalAmount),
            idempotencyKey: `payment:${checkoutKey}:${Number.isFinite(idx) ? idx : 0}`,
            paymentMethod: data.paymentMethod,
            expiresAt: data.expiresAt
          });

          payments.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            ...payment
          });
        } catch (error: any) {
          failedPayments.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            error: error.response?.data?.error || error.message
          });
        }
      }

      // Best-effort: cart may already be empty.
      await cartClient.clearUserCart(data.userId);

      return {
        isExisting: true,
        ordersCreated: existingOrders.length,
        orders: existingOrders,
        payments,
        failedPayments: failedPayments.length > 0 ? failedPayments : undefined,
        message: 'Idempotent retry: returned existing orders'
      };
    }

    let user: AuthUser;
    try {
      user = await this.fetchUser(data.userId);
    } catch (err: any) {
      // Local/dev testing: allow order creation even when auth-service isn't running yet.
      // We fall back to the checkout shipping snapshot for customer identity fields.
      if (process.env.NODE_ENV === 'development') {
        const fullName = (data.shippingAddress?.name || '').trim();
        const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
        user = {
          id: data.userId,
          firstName: firstName || undefined,
          lastName: rest.length > 0 ? rest.join(' ') : undefined,
          phoneNumber: data.shippingAddress?.phone || '',
          email: null
        };
        console.warn('Auth-service unavailable; using shipping snapshot as customer identity (development mode).', {
          userId: data.userId,
          error: err?.message
        });
      } else {
        throw err;
      }
    }

    // Fetch product info and compute item-level prices, then group by seller (sellerId) or house-brand (null)
    const enriched = await Promise.all(data.items.map(async (item) => {
      const { product, variant, unitPrice } = await this.utils.getProductAndUnitPrice(item.productId, item.variantId);

      const quantity = item.quantity;
      const itemSubtotal = unitPrice * quantity;
      const sellerId = product.sellerId;

      return {
        productId: item.productId,
        variantId: item.variantId ?? null,
        sellerId,
        itemType: sellerId ? 'seller_product' : 'brand_product',
        quantity,
        unitPrice,
        subtotal: itemSubtotal,
        snapshot: {
          snapshotProductName: product.name,
          snapshotVariantName: variant ? (variant.sizeName || variant.size || variant.sku) : null,
          snapshotSku: variant?.sku || product.productCode,
          snapshotImageUrl: product.primaryImageUrl || product.images?.find(i => i.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || null,
        }
      };
    }));

    const groupKeys: Array<string> = [];
    const groups = new Map<string, typeof enriched>();
    for (const item of enriched) {
      const key = item.sellerId ?? 'HOUSE_BRAND';
      if (!groups.has(key)) groupKeys.push(key);
      groups.set(key, [...(groups.get(key) || []), item]);
    }

    const groupSubtotals = groupKeys.map((k) => (groups.get(k) || []).reduce((sum, i) => sum + i.subtotal, 0));
    const discountAmount = Math.max(0, Math.floor(data.discountAmount || 0));
    const discounts = this.computeDiscountAllocation(groupSubtotals, discountAmount);

    const baseOrderNumber = this.utils.generateOrderNumber();

    const createdOrders = await prisma.$transaction(async (tx) => {
      const orders = [];

      for (let idx = 0; idx < groupKeys.length; idx++) {
        const key = groupKeys[idx]!;
        const items = groups.get(key)!;
        const subtotal = groupSubtotals[idx]!;
        const orderDiscount = discounts[idx]!;
        const totalAmount = subtotal - orderDiscount;

        const sellerId = key === 'HOUSE_BRAND' ? null : key;
        const orderSource = sellerId ? 'seller' : 'brand';
        const orderNumber = groupKeys.length > 1 ? `${baseOrderNumber}-${idx + 1}` : baseOrderNumber;
        const idempotencyKey = `${checkoutKey}:${idx}`;

        const order = await tx.order.create({
          data: {
            orderNumber,
            userId: data.userId!,
            orderSource: orderSource as any,
            sellerId,
            subtotal,
            discountAmount: orderDiscount,
            shippingCost: 0,
            taxAmount: 0,
            totalAmount,
            currency: 'IDR',
            shippingAddressId: data.shippingAddressId ?? null,
            shippingRecipient: data.shippingAddress.name,
            shippingPhone: data.shippingAddress.phone,
            shippingStreet: data.shippingAddress.address,
            shippingDistrict: data.shippingAddress.district ?? null,
            shippingCity: data.shippingAddress.city,
            shippingProvince: data.shippingAddress.province,
            shippingPostalCode: data.shippingAddress.postalCode || '-',
            shippingLatitude: data.shippingAddress.latitude ?? null,
            shippingLongitude: data.shippingAddress.longitude ?? null,
            customerEmail: user.email ?? null,
            customerPhone: user.phoneNumber,
            customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || data.shippingAddress.name,
            customerNotes: data.shippingNotes ?? null,
            status: 'pending',
            idempotencyKey,
            items: {
              create: items.map((i) => ({
                itemType: i.itemType as any,
                productId: i.productId,
                variantId: i.variantId,
                sellerId: i.sellerId,
                snapshotProductName: i.snapshot.snapshotProductName,
                snapshotVariantName: i.snapshot.snapshotVariantName,
                snapshotSku: i.snapshot.snapshotSku,
                snapshotImageUrl: i.snapshot.snapshotImageUrl,
                unitPrice: i.unitPrice,
                quantity: i.quantity,
                subtotal: i.subtotal,
                discountAmount: 0,
                totalAmount: i.subtotal
              }))
            }
          },
          include: { items: true }
        });

        try {
          await outboxService.orderCreated({
            id: order.id,
            orderNumber: order.orderNumber,
            userId: order.userId,
            sellerId: order.sellerId
          }, tx);
        } catch (err: any) {
          if (process.env.NODE_ENV !== 'development') throw err;
          console.warn('Outbox write skipped (development mode):', err?.message || err);
        }

        orders.push(order);
      }

      return orders;
    });

    const payments: Array<{ orderId: string; orderNumber: string; [key: string]: any }> = [];
    const failedPayments: Array<{ orderId: string; orderNumber: string; error: any }> = [];

    for (let idx = 0; idx < createdOrders.length; idx++) {
      const order = createdOrders[idx]!;
      try {
        const payment = await paymentClient.createPayment({
          orderId: order.id,
          userId: data.userId,
          amount: Number(order.totalAmount),
          idempotencyKey: `payment:${checkoutKey}:${idx}`,
          paymentMethod: data.paymentMethod,
          expiresAt: data.expiresAt
        });

        payments.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          ...payment
        });

        await prisma.$transaction(async (tx) => {
          await this.repository.updateStatus({
            orderId: order.id,
            newStatus: 'awaiting_payment',
            reason: 'payment_created',
            notes: 'Payment invoice created',
            changedBy: undefined,
            changedByType: 'system'
          }, tx);

          try {
            await outboxService.orderStatusChanged({
              orderId: order.id,
              orderNumber: order.orderNumber,
              fromStatus: 'pending',
              toStatus: 'awaiting_payment',
              reason: 'payment_created',
              notes: 'Payment invoice created'
            }, tx);
          } catch (err: any) {
            if (process.env.NODE_ENV !== 'development') throw err;
            console.warn('Outbox write skipped (development mode):', err?.message || err);
          }
        });
      } catch (error: any) {
        failedPayments.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          error: error.response?.data?.error || error.message
        });
        console.error(`Failed to create payment for order ${order.id}:`, error.message);
      }
    }

    await cartClient.clearUserCart(data.userId);

    if (failedPayments.length === createdOrders.length) {
      throw new BadRequestError('All payment creations failed');
    }

    return {
      isExisting: false,
      ordersCreated: createdOrders.length,
      orders: createdOrders,
      payments,
      failedPayments: failedPayments.length > 0 ? failedPayments : undefined,
      message: failedPayments.length > 0
        ? `Partial success: ${payments.length}/${createdOrders.length} payments created.`
        : (createdOrders.length > 1
            ? `Created ${createdOrders.length} orders (split by seller)`
            : 'Order created successfully')
    };
  }

  async getOrder(id: string) {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  async getOrderByNumber(orderNumber: string) {
    const order = await this.repository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  async getOrders(filters: OrderFilters): Promise<PaginatedResponse<any>> {
    return this.repository.findAll(filters);
  }

  async updateOrderStatus(data: UpdateOrderStatusDTO) {
    const order = await this.repository.findById(data.orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ['awaiting_payment', 'paid', 'cancelled'],
      awaiting_payment: ['paid', 'cancelled'],
      paid: ['confirmed', 'processing', 'cancelled', 'refunded', 'partially_refunded'],
      confirmed: ['processing', 'cancelled'],
      processing: ['ready_to_ship', 'cancelled'],
      ready_to_ship: ['shipped', 'cancelled'],
      shipped: ['in_transit', 'delivered'],
      in_transit: ['out_for_delivery', 'delivered'],
      out_for_delivery: ['delivered'],
      delivered: ['completed', 'refunded', 'partially_refunded'],
      completed: ['refunded', 'partially_refunded'],
      cancelled: ['refunded', 'partially_refunded'],
      refunded: [],
      partially_refunded: [],
    };

    const current = order.status as OrderStatus;
    const allowed = validTransitions[current] || [];

    if (!allowed.includes(data.newStatus)) {
      throw new BadRequestError(`Cannot transition from ${current} to ${data.newStatus}`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await this.repository.updateStatus(data, tx);
      if (!updatedOrder) {
        throw new NotFoundError('Order not found');
      }

      await outboxService.orderStatusChanged({
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        fromStatus: current,
        toStatus: data.newStatus,
        reason: data.reason,
        notes: data.notes
      }, tx);

      return updatedOrder;
    });

    return updated;
  }

  async updateShippingCost(orderId: string, shippingCost: number, taxAmount: number = 0) {
    if (shippingCost < 0) {
      throw new BadRequestError('Shipping cost cannot be negative');
    }
    const updated = await this.repository.updateShippingCost(orderId, shippingCost, taxAmount);
    if (!updated) throw new NotFoundError('Order not found');
    return updated;
  }
}
