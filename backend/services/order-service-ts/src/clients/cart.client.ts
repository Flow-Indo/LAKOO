import type { AxiosInstance } from 'axios';
import { getServiceAuthHeaders } from '../utils/serviceAuth';
import { createHttpClient } from './http';

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:3003';
export class CartClient {
  private client: AxiosInstance;

  constructor() {
    this.client = createHttpClient(CART_SERVICE_URL);
  }

  async clearUserCart(userId: string): Promise<void> {
    try {
      await this.client.delete(`/api/cart/${userId}`, {
        headers: {
          ...getServiceAuthHeaders(),
        }
      });
    } catch (error: any) {
      // Cart-service clear is best-effort (non-blocking).
      const message = error?.response?.data?.error || error?.message || 'Failed to clear cart';
      console.error('CartClient.clearUserCart failed:', { userId, message });
    }
  }
}

export const cartClient = new CartClient();

// Backwards-compatible function export
export async function clearUserCart(userId: string): Promise<void> {
  return cartClient.clearUserCart(userId);
}
