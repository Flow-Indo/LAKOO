import axios from 'axios';
import { getServiceAuthHeaders } from '../utils/serviceAuth';
import { withRetry } from '../lib/retry';

const SELLER_SERVICE_URL = process.env.SELLER_SERVICE_URL || 'http://localhost:3015';
const OUTBOUND_HTTP_TIMEOUT_MS = Number.parseInt(process.env.OUTBOUND_HTTP_TIMEOUT_MS || '5000', 10);

function isRetryableAxiosError(err: unknown) {
  if (!axios.isAxiosError(err)) return false;
  const status = err.response?.status;
  // retry network errors + 5xx; avoid retrying 4xx
  return !status || status >= 500;
}

/**
 * Seller Service Client
 *
 * Handles communication with seller-service
 */

export class SellerServiceClient {
  /**
   * Get seller information
   */
  async getSeller(sellerId: string): Promise<{
    id: string;
    userId: string;
    brandName: string | null;
    status: string;
  } | null> {
    try {
      const response = await withRetry(
        () =>
          axios.get(`${SELLER_SERVICE_URL}/api/sellers/${sellerId}`, {
            headers: getServiceAuthHeaders(),
            timeout: OUTBOUND_HTTP_TIMEOUT_MS
          }),
        {
          retries: 2,
          minDelayMs: 200,
          maxDelayMs: 1500,
          factor: 2,
          jitterRatio: 0.2,
          isRetryable: isRetryableAxiosError
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching seller:', error.message);
      return null;
    }
  }

  /**
   * Increment seller's product count when product is approved
   */
  async incrementProductCount(sellerId: string): Promise<boolean> {
    try {
      await axios.post(
        `${SELLER_SERVICE_URL}/api/sellers/${sellerId}/products/increment`,
        {},
        {
          headers: getServiceAuthHeaders(),
          timeout: OUTBOUND_HTTP_TIMEOUT_MS
        }
      );

      return true;
    } catch (error: any) {
      console.error('Error incrementing product count:', error.message);
      return false;
    }
  }

  /**
   * Decrement seller's product count when product is deleted
   */
  async decrementProductCount(sellerId: string): Promise<boolean> {
    try {
      await axios.post(
        `${SELLER_SERVICE_URL}/api/sellers/${sellerId}/products/decrement`,
        {},
        {
          headers: getServiceAuthHeaders(),
          timeout: OUTBOUND_HTTP_TIMEOUT_MS
        }
      );

      return true;
    } catch (error: any) {
      console.error('Error decrementing product count:', error.message);
      return false;
    }
  }

  /**
   * Notify seller about draft approval/rejection
   */
  async notifyDraftDecision(
    sellerId: string,
    draftId: string,
    decision: 'approved' | 'rejected' | 'changes_requested',
    message: string
  ): Promise<boolean> {
    try {
      await axios.post(
        `${SELLER_SERVICE_URL}/api/sellers/${sellerId}/notifications`,
        {
          type: `draft_${decision}`,
          draftId,
          message
        },
        {
          headers: getServiceAuthHeaders(),
          timeout: OUTBOUND_HTTP_TIMEOUT_MS
        }
      );

      return true;
    } catch (error: any) {
      console.error('Error notifying seller:', error.message);
      return false;
    }
  }
}

export const sellerServiceClient = new SellerServiceClient();
