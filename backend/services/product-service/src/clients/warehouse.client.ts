import axios from 'axios';
import { getServiceAuthHeaders } from '../utils/serviceAuth';
import { withRetry } from '../lib/retry';

const WAREHOUSE_SERVICE_URL = process.env.WAREHOUSE_SERVICE_URL || 'http://localhost:3012';
const OUTBOUND_HTTP_TIMEOUT_MS = Number.parseInt(process.env.OUTBOUND_HTTP_TIMEOUT_MS || '5000', 10);

function isRetryableAxiosError(err: unknown) {
  if (!axios.isAxiosError(err)) return false;
  const status = err.response?.status;
  // retry network errors + 5xx; avoid retrying 4xx
  return !status || status >= 500;
}

/**
 * Warehouse Service Client
 *
 * Handles communication with warehouse-service
 * NOTE: Only used for LAKOO house brand products (sellerId = null)
 */

export interface WarehouseInventory {
  productId: string;
  variantId: string;
  sku: string;
  availableQuantity: number;
  reservedQuantity: number;
  inTransitQuantity: number;
}

export class WarehouseServiceClient {
  /**
   * Check if a product/variant is available in warehouse
   * Only for house brand products (sellerId = null)
   */
  async checkAvailability(
    productId: string,
    variantId?: string
  ): Promise<WarehouseInventory | null> {
    try {
      const response = await withRetry(
        () =>
          axios.get(`${WAREHOUSE_SERVICE_URL}/api/warehouse/inventory/status`, {
            params: {
              productId,
              variantId
            },
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
      console.error('Error checking warehouse availability:', error.message);
      return null;
    }
  }

  /**
   * Check if adding a variant would violate grosir bundle constraints
   * Only for house brand products with grosir restrictions
   */
  async checkBundleOverflow(
    productId: string,
    variantId?: string
  ): Promise<{
    isLocked: boolean;
    reason: string;
    canOrder: boolean;
    overflowVariants?: string[];
  }> {
    try {
      const response = await withRetry(
        () =>
          axios.get(`${WAREHOUSE_SERVICE_URL}/api/warehouse/check-bundle-overflow`, {
            params: {
              productId,
              variantId
            },
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
      console.error('Error checking bundle overflow:', error.message);
      // Return safe default
      return {
        isLocked: false,
        reason: 'Bundle check failed (default allow)',
        canOrder: true
      };
    }
  }

  /**
   * Get overflow status for all variants (useful for UI/config verification)
   */
  async checkAllVariantsOverflow(productId: string): Promise<any> {
    const response = await withRetry(
      () =>
        axios.get(`${WAREHOUSE_SERVICE_URL}/api/warehouse/check-all-variants`, {
          params: { productId },
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
  }

  /**
   * Fetch all warehouse inventory rows for a product (admin endpoint).
   * Used to make inventory creation idempotent from product-service.
   */
  async getAllInventory(productId: string): Promise<Array<{ productId: string; variantId: string | null; sku: string }>> {
    const response = await withRetry(
      () =>
        axios.get(`${WAREHOUSE_SERVICE_URL}/api/admin/inventory`, {
          params: { productId },
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
  }

  /**
   * Ensure warehouse inventory exists for a product/variant (admin endpoint).
   * Returns true if created, false if already existed.
   */
  async ensureInventoryRecord(data: {
    productId: string;
    variantId: string;
    sku: string;
    maxStockLevel: number;
    reorderPoint: number;
    skipCheck?: boolean;
  }): Promise<boolean> {
    if (!data.skipCheck) {
      const existing = await this.getAllInventory(data.productId);
      const alreadyExists = existing.some(row => row.variantId === data.variantId);
      if (alreadyExists) return false;
    }

    await axios.post(
      `${WAREHOUSE_SERVICE_URL}/api/admin/inventory`,
      {
        productId: data.productId,
        variantId: data.variantId,
        sku: data.sku,
        maxStockLevel: data.maxStockLevel,
        reorderPoint: data.reorderPoint
      },
      {
        headers: getServiceAuthHeaders(),
        timeout: OUTBOUND_HTTP_TIMEOUT_MS
      }
    );

    return true;
  }

  /**
   * Create/update grosir bundle configuration in warehouse-service (admin endpoint).
   */
  async updateBundleConfig(data: {
    productId: string;
    bundleName?: string;
    totalUnits: number;
    sizeBreakdown: Record<string, number>;
    bundleCost: string;
    minBundleOrder?: number;
  }): Promise<any> {
    const response = await axios.post(
      `${WAREHOUSE_SERVICE_URL}/api/admin/bundle-config`,
      data,
      {
        headers: getServiceAuthHeaders(),
        timeout: OUTBOUND_HTTP_TIMEOUT_MS
      }
    );

    return response.data.data;
  }

  /**
   * Create initial warehouse inventory for a new house brand product.
   */
  async createInventoryForProduct(
    productId: string,
    variants: Array<{
      variantId: string;
      sku: string;
      initialQuantity?: number;
    }>
  ): Promise<boolean> {
    try {
      for (const v of variants) {
        await axios.post(
          `${WAREHOUSE_SERVICE_URL}/api/admin/inventory`,
          {
            productId,
            variantId: v.variantId,
            sku: v.sku,
            quantity: v.initialQuantity ?? 0
          },
          {
            headers: getServiceAuthHeaders(),
            timeout: OUTBOUND_HTTP_TIMEOUT_MS
          }
        );
      }

      return true;
    } catch (error: any) {
      console.error('Error creating warehouse inventory:', error.message);
      return false;
    }
  }

  // NOTE: "grosir config" is exposed in warehouse-service via
  // `/api/warehouse/check-all-variants?productId=...` and admin-only config endpoints.
}

export const warehouseServiceClient = new WarehouseServiceClient();
