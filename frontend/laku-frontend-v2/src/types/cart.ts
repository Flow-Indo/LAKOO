export interface CartProduct {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variations?: string; // e.g., "Size: M, Color: Black"
  stock: number;
  isSelected: boolean;
}

export interface StoreCart {
  storeId: string;
  storeName: string;
  storeAvatar: string;
  hasFreeGift: boolean;
  products: CartProduct[];
  vouchers: StoreVoucher[];
  shippingInfo: string;
}

export interface StoreVoucher {
  id: string;
  title: string;
  description: string;
  discount: string; // e.g., "Up to Rp50K off"
  isApplied: boolean;
}

export interface PlatformVoucher {
  id: string;
  code: string;
  isApplied: boolean;
}

export interface CartSummary {
  selectedCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}