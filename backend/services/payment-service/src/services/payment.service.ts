import { PaymentRepository } from '../repositories/payment.repository';
import { CreatePaymentDTO } from '../types';
import { xenditInvoiceClient } from '../config/xendit';
import { CreateInvoiceRequest } from 'xendit-node/invoice/models';
import { notificationClient } from '../clients/notification.client';
import { outboxService } from './outbox.service';
import axios from 'axios';
import { getServiceAuthHeaders } from '../utils/serviceAuth';
import { prisma } from '../lib/prisma';
import { ForbiddenError, NotFoundError } from '../middleware/error-handler';

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3006';
const OUTBOUND_HTTP_TIMEOUT_MS = Number.parseInt(process.env.OUTBOUND_HTTP_TIMEOUT_MS || '8000', 10);

export class PaymentService {
  private repository: PaymentRepository;

  constructor() {
    this.repository = new PaymentRepository();
  }

  /**
   * Fetch order data from order-service
   */
  private async fetchOrder(orderId: string): Promise<any> {
    try {
      const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders/${orderId}`, {
        headers: getServiceAuthHeaders(),
        timeout: OUTBOUND_HTTP_TIMEOUT_MS
      });
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch order');
      }
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError('Order not found');
      }
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  /**
   * Update order status via order-service
   */
  private async updateOrderStatus(orderId: string, newStatus: string): Promise<void> {
    try {
      await axios.put(
        `${ORDER_SERVICE_URL}/api/orders/${orderId}/status`,
        { newStatus },
        { headers: getServiceAuthHeaders(), timeout: OUTBOUND_HTTP_TIMEOUT_MS }
      );
    } catch (error: any) {
      // Do not fail payment processing if order-service is unavailable.
      // The outbox event (`payment.paid`) is the source of truth for downstream reconciliation.
      console.error(`Failed to update order ${orderId} status:`, error.message);
    }
  }

  /**
   * Create a new payment for an order
   */
  async createPayment(data: CreatePaymentDTO, options?: { skipOrderLookup?: boolean }) {
    // Check for existing payment with same idempotency key
    if (data.idempotencyKey) {
      const existingPayment = await this.repository.findByIdempotencyKey(data.idempotencyKey);
      if (existingPayment) {
        // Return existing payment regardless of status for idempotency
        return {
          payment: existingPayment,
          paymentUrl: existingPayment.gatewayInvoiceUrl,
          invoiceId: existingPayment.gatewayTransactionId,
          isExisting: true
        };
      }
    }

    // Option 2: do not fetch user profile from auth-service.
    // For internal calls (order-service -> payment-service), we also avoid calling back into order-service
    // to prevent circular dependency failures. Internal callers should pass an order snapshot via `metadata`.
    const shouldLookupOrder = options?.skipOrderLookup !== true;
    const order = shouldLookupOrder ? await this.fetchOrder(data.orderId) : null;
    if (order?.userId && order.userId !== data.userId) {
      throw new ForbiddenError('Order does not belong to authenticated user');
    }

    const customerName =
      (data.metadata?.customerName as string | undefined) ||
      order?.customerName ||
      order?.shippingRecipient ||
      order?.shippingAddress?.name ||
      '';

    const customerEmail =
      (data.metadata?.customerEmail as string | undefined) ||
      order?.customerEmail ||
      '';

    const customerPhone =
      (data.metadata?.customerPhone as string | undefined) ||
      order?.customerPhone ||
      order?.shippingPhone ||
      order?.shippingAddress?.phone ||
      '';

    const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    const userEmail =
      customerEmail || this.generatePlaceholderEmailForUser(data.userId, customerPhone || undefined);

    const { givenNames, surname } = this.splitCustomerName(customerName);
    const customer =
      givenNames || surname || customerPhone
        ? {
            givenNames: givenNames || 'Customer',
            surname: surname || '',
            email: userEmail,
            ...(customerPhone ? { mobileNumber: customerPhone } : {})
          }
        : undefined;

    // Create Xendit invoice
    const invoiceData: CreateInvoiceRequest = {
      externalId: `order-${data.orderId}-${Date.now()}`,
      amount: data.amount,
      payerEmail: userEmail,
      description: `Payment for order ${data.orderId}`,
      invoiceDuration: expiresAt
        ? Math.floor((expiresAt.getTime() - Date.now()) / 1000).toString()
        : '86400',
      currency: 'IDR',
      shouldSendEmail: Boolean(customerEmail),
      ...(customer ? { customer } : {}),
      successRedirectUrl: process.env.PAYMENT_SUCCESS_URL,
      failureRedirectUrl: process.env.PAYMENT_FAILURE_URL
    };

    const invoice = await xenditInvoiceClient.createInvoice({
      data: invoiceData
    });

    const payment = await prisma.$transaction(async (tx) => {
      const created = await this.repository.create(
        data,
        invoice.invoiceUrl || '',
        invoice.id || '',
        tx
      );

      // Transactional outbox: publish in the same DB transaction.
      await outboxService.paymentCreated(created, tx);

      return created;
    });

    return {
      payment,
      paymentUrl: invoice.invoiceUrl,
      invoiceId: invoice.id
    };
  }

  /**
   * Handle Xendit webhook callback when payment is completed
   */
  async handlePaidCallback(callbackData: any) {
    const payment = await this.repository.findByGatewayTransactionId(callbackData.id);

    if (!payment) {
      throw new Error('Payment not found for transaction ID: ' + callbackData.id);
    }

    if (payment.status === 'paid') {
      console.log(`Payment ${payment.id} already marked as paid - skipping`);
      return { message: 'Payment already processed' };
    }

    const gatewayFee = callbackData.fees_paid_amount || 0;

    // Mark payment as paid + publish outbox event transactionally
    const updatedPayment = await prisma.$transaction(async (tx) => {
      const updated = await this.repository.markPaid(payment.id, gatewayFee, callbackData, tx);
      await outboxService.paymentPaid(updated, tx);
      return updated;
    });

    // Update order status
    await this.updateOrderStatus(payment.orderId, 'paid');

    // Send notification to user
    await this.sendPaymentNotification(payment.userId, payment.orderId, 'success');

    return {
      message: 'Payment processed successfully',
      payment: updatedPayment
    };
  }

  /**
   * Handle Xendit webhook callback when payment expires
   */
  async handleExpiredCallback(callbackData: any) {
    const payment = await this.repository.findByGatewayTransactionId(callbackData.id);

    if (!payment) {
      throw new Error('Payment not found for transaction ID: ' + callbackData.id);
    }

    if (payment.status !== 'pending') {
      console.log(`Payment ${payment.id} not pending - skipping expiration`);
      return { message: 'Payment not pending' };
    }

    const updatedPayment = await prisma.$transaction(async (tx) => {
      const updated = await this.repository.markExpired(payment.id, tx);
      await outboxService.paymentExpired(updated, tx);
      return updated;
    });

    return {
      message: 'Payment marked as expired',
      payment: updatedPayment
    };
  }

  /**
   * Get payment by order ID
   */
  async getPaymentByOrderId(orderId: string) {
    return this.repository.findByOrderId(orderId);
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string) {
    return this.repository.findById(paymentId);
  }

  /**
   * Get payments for a user
   */
  async getPaymentsByUserId(userId: string, options?: { limit?: number; offset?: number }) {
    return this.repository.findByUserId(userId, options);
  }

  /**
   * Find payments eligible for settlement within a period
   */
  async findEligibleForSettlement(periodStart: Date, periodEnd: Date) {
    return this.repository.findEligibleForSettlement(periodStart, periodEnd);
  }

  /**
   * Get payment statistics for a period
   */
  async getPaymentStats(startDate: Date, endDate: Date) {
    return this.repository.getPaymentStats(startDate, endDate);
  }

  /**
   * Send payment notification to user
   */
  private async sendPaymentNotification(userId: string, orderId: string, status: 'success' | 'failed') {
    try {
      let orderNumber = '';
      try {
        const order = await this.fetchOrder(orderId);
        orderNumber = order.orderNumber || order.order_number || '';
      } catch (error) {
        console.error('Failed to fetch order for notification:', error);
      }

      await notificationClient.sendNotification({
        userId: userId,
        type: status === 'success' ? 'payment_success' : 'payment_failed',
        title: status === 'success' ? 'Payment Successful' : 'Payment Failed',
        message: status === 'success'
          ? `Your payment for order ${orderNumber} has been confirmed!`
          : `Payment failed for order ${orderNumber}. Please try again.`,
        actionUrl: `/orders/${orderId}`,
        relatedId: orderId
      });
    } catch (error) {
      console.error('Failed to send payment notification:', error);
    }
  }

  /**
   * Generate placeholder email when customer email is missing.
   */
  private generatePlaceholderEmailForUser(userId: string, phoneNumber?: string): string {
    const safe =
      phoneNumber && phoneNumber.trim().length > 0
        ? phoneNumber.replace(/[^0-9+]/g, '')
        : userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
    const domain = process.env.PLACEHOLDER_EMAIL_DOMAIN || 'lakoo.id';
    return `noreply+${safe}@${domain}`;
  }

  private splitCustomerName(name: string): { givenNames: string; surname: string } {
    const trimmed = (name || '').trim();
    if (!trimmed) return { givenNames: '', surname: '' };
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return { givenNames: parts[0] || '', surname: '' };
    return { givenNames: parts[0] || '', surname: parts.slice(1).join(' ') };
  }
}
