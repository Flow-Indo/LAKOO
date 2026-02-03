import { productClient } from '../clients/product.client';

export class OrderUtils {
  generateOrderNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `ORD-${date}-${random}`;
  }

  toNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return Number(value);
    if (value && typeof value.toNumber === 'function') return value.toNumber();
    return Number(value);
  }

  async getProductAndUnitPrice(productId: string, variantId?: string) {
    const product = await productClient.fetchProduct(productId);

    if (variantId) {
      const variant = product.variants?.find(v => v.id === variantId);
      if (!variant) {
        throw new Error(`Variant ${variantId} not found for product ${productId}`);
      }
      return {
        product,
        variant,
        unitPrice: this.toNumber(variant.sellPrice)
      };
    }

    return {
      product,
      variant: null,
      unitPrice: this.toNumber(product.baseSellPrice)
    };
  }
}
