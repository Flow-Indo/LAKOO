import type { AxiosInstance } from 'axios';
import { getServiceAuthHeaders } from '../utils/serviceAuth';
import { createHttpClient } from './http';

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3007';

export type CreatePaymentRequest = {
  orderId: string;
  userId: string;
  amount: number;
  idempotencyKey: string;
  paymentMethod?: string;
  expiresAt?: string;
};

export class PaymentClient {
  private client: AxiosInstance;

  constructor() {
    this.client = createHttpClient(PAYMENT_SERVICE_URL);
  }

  async createPayment(data: CreatePaymentRequest): Promise<any> {
    try {
      const response = await this.client.post('/api/payments', data, {
        headers: {
          'Content-Type': 'application/json',
          ...getServiceAuthHeaders(),
        }
      });

      // payment-service wraps responses as { success: true, data: {...} }
      return response.data?.data ?? response.data;
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Failed to create payment';
      console.error('PaymentClient.createPayment failed:', {
        orderId: data.orderId,
        idempotencyKey: data.idempotencyKey,
        message
      });
      throw new Error(message);
    }
  }
}

export const paymentClient = new PaymentClient();

// Backwards-compatible function export
export async function createPayment(data: CreatePaymentRequest): Promise<any> {
  return paymentClient.createPayment(data);
}
