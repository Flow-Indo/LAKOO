import axios, { AxiosInstance } from 'axios';
import { withRetry } from '../lib/retry';
import { getServiceAuthHeaders } from '../utils/serviceAuth';

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

const OUTBOUND_HTTP_TIMEOUT_MS = (() => {
  const raw = process.env.OUTBOUND_HTTP_TIMEOUT_MS;
  const parsed = raw ? Number.parseInt(raw, 10) : 5000;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5000;
})();

function isRetryableAxiosError(err: any) {
  const code = err?.code as string | undefined;
  const retryableCodes = new Set([
    'ECONNABORTED',
    'ETIMEDOUT',
    'ECONNRESET',
    'ENOTFOUND',
    'EAI_AGAIN',
    'ECONNREFUSED'
  ]);
  if (code && retryableCodes.has(code)) return true;

  const status = err?.response?.status as number | undefined;
  if (typeof status === 'number' && status >= 500) return true;

  if (err?.isAxiosError && err?.response === undefined) return true;

  return false;
}

export type ProductDimensions = {
  id: string;
  baseSellPrice?: any;
  weightGrams?: number | null;
  lengthCm?: any;
  widthCm?: any;
  heightCm?: any;
};

export type VariantDimensions = {
  id: string;
  productId: string;
  weightGrams?: number | null;
};

export class ProductClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: PRODUCT_SERVICE_URL,
      timeout: OUTBOUND_HTTP_TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async fetchProduct(productId: string): Promise<ProductDimensions> {
    return withRetry(
      async () => {
        const res = await this.client.get(`/api/products/id/${productId}`, {
          headers: {
            ...getServiceAuthHeaders()
          }
        });
        return res.data;
      },
      {
        retries: 2,
        minDelayMs: 50,
        maxDelayMs: 300,
        factor: 2,
        jitterRatio: 0.2,
        isRetryable: isRetryableAxiosError
      }
    );
  }

  async fetchVariant(variantId: string): Promise<VariantDimensions> {
    return withRetry(
      async () => {
        const res = await this.client.get(`/api/products/variants/${variantId}`, {
          headers: {
            ...getServiceAuthHeaders()
          }
        });
        return res.data;
      },
      {
        retries: 2,
        minDelayMs: 50,
        maxDelayMs: 300,
        factor: 2,
        jitterRatio: 0.2,
        isRetryable: isRetryableAxiosError
      }
    );
  }
}

export const productClient = new ProductClient();

