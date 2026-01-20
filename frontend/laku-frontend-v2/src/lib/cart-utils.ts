import { CartItem } from '@/types';

export interface StoreSection {
  storeId: string;
  storeName: string;
  storeLocation?: string;
  badges?: string[];
  voucherAvailable?: boolean;
  items: CartItem[];
}

/**
 * Transform flat cart items array into grouped structure by store.
 * Handles multiple items from same store and carries store metadata.
 */
export function groupCartItemsByStore(cartItems: CartItem[]): StoreSection[] {
  const map = new Map<string, StoreSection>();

  for (const item of cartItems) {
    const storeId = item.store?.id || 'unknown-store';
    if (!map.has(storeId)) {
      map.set(storeId, {
        storeId,
        storeName: item.store?.name || 'Unknown Store',
        storeLocation: item.store?.location,
        badges: [],
        voucherAvailable: false,
        items: [],
      });
    }

    const section = map.get(storeId)!;
    section.items.push(item);

    // lightweight heuristics: mark voucher available when any item has discount
    if (item.discount && item.discount > 0) {
      section.voucherAvailable = true;
      section.badges = Array.from(new Set([...(section.badges || []), 'discount']));
    }
  }

  return Array.from(map.values());
}

/**
 * Calculate potential savings at store level (sum of originalPrice - price for items)
 */
export function calculateStoreSavings(section: StoreSection): number {
  return section.items.reduce((acc, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return acc + (item.originalPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);
}

