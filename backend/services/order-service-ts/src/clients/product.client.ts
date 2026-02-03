import type { AxiosInstance } from 'axios';
import { getServiceAuthHeaders } from '../utils/serviceAuth';
import { createHttpClient } from './http';

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

export type ProductResponse = {
  id: string;
  sellerId: string | null;
  productCode: string;
  name: string;
  baseSellPrice: any;
  primaryImageUrl?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  variants?: Array<{
    id: string;
    sku: string;
    sellPrice: any;
    size?: string | null;
    sizeName?: string | null;
    color?: string | null;
    colorName?: string | null;
  }>;
  images?: Array<{ imageUrl: string; isPrimary?: boolean }>;
};

export class ProductClient {
  private client: AxiosInstance;

  constructor() {
    this.client = createHttpClient(PRODUCT_SERVICE_URL);
  }

  async fetchProduct(productId: string): Promise<ProductResponse> {
    try {
      const response = await this.client.get(`/api/products/id/${productId}`, {
        headers: {
          ...getServiceAuthHeaders()
        }
      });
      return response.data;
    } catch (error: any) {
      // Prefer a concise error for upstream handling.
      const message = error?.response?.data?.error || error?.message || 'Failed to fetch product';
      console.error('ProductClient.fetchProduct failed:', { productId, message });
      throw new Error(message);
    }
  }
}

export const productClient = new ProductClient();

// Backwards-compatible function export
export async function fetchProduct(productId: string): Promise<ProductResponse> {
  return productClient.fetchProduct(productId);
}
