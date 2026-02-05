import type { AxiosInstance } from 'axios';
import { getServiceAuthHeaders } from '../utils/serviceAuth';
import { createHttpClient } from './http';

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3007';
const PAYMENT_SERVICE_TIMEOUT_MS = (() => {
  const raw = process.env.PAYMENT_SERVICE_TIMEOUT_MS || process.env.OUTBOUND_HTTP_TIMEOUT_MS;
  const parsed = raw ? Number.parseInt(raw, 10) : 20000;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 20000;
})();

const PAYMENT_SERVICE_RETRIES = (() => {
  const raw = process.env.PAYMENT_SERVICE_RETRIES;
  const parsed = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 1;
})();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryablePaymentError(err: any) {
  const code = err?.code as string | undefined;
  if (code === 'ECONNABORTED' || code === 'ETIMEDOUT' || code === 'ECONNRESET') return true;
  const message = String(err?.message || '').toLowerCase();
  if (message.includes('timeout')) return true;
  const status = err?.response?.status as number | undefined;
  if (typeof status === 'number' && status >= 500) return true;
  return false;
}

export type CreatePaymentRequest = {
  orderId: string;
  userId: string;
  amount: number;
  idempotencyKey: string;
  paymentMethod?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
};

export class PaymentClient {
  private client: AxiosInstance;

  constructor() {
    this.client = createHttpClient(PAYMENT_SERVICE_URL, PAYMENT_SERVICE_TIMEOUT_MS);
  }

  async createPayment(data: CreatePaymentRequest): Promise<any> {
    let attempt = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
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
        const canRetry = attempt < PAYMENT_SERVICE_RETRIES && isRetryablePaymentError(error);

        console.error('PaymentClient.createPayment failed:', {
          orderId: data.orderId,
          idempotencyKey: data.idempotencyKey,
          attempt,
          canRetry,
          message
        });

        if (!canRetry) {
          throw new Error(message);
        }

        attempt += 1;
        await sleep(250);
      }
    }
  }
}

export const paymentClient = new PaymentClient();

// Backwards-compatible function export
export async function createPayment(data: CreatePaymentRequest): Promise<any> {
  return paymentClient.createPayment(data);
}
