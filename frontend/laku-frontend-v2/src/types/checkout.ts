// Checkout Modal Type Definitions

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CheckoutProduct;
}

export interface CheckoutProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  images?: string[];
  colors: ColorVariant[];
  sizes: SizeVariant[];
  shippingOptions: ShippingOption[];
  vouchers: Voucher[];
}

export interface ColorVariant {
  id: string;
  name: string;
  label?: string;
  image: string;
  stock: number;
}

export interface SizeVariant {
  id: string;
  name: string;
  price: number;
  weight?: string;
  weightRecommendation?: string;
  stock: number;
  measurements?: {
    waist?: string;
    hip?: string;
    length?: string;
    inseam?: string;
    bust?: string;
    sleeve?: string;
  };
}

export interface ShippingOption {
  id: string;
  name: string;
  courier: string;
  service: string;
  price: number;
  estimatedDays: string;
  isFree: boolean;
  isFast: boolean;
}

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minPurchase?: number;
  maxDiscount?: number;
  description: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon?: string;
}

export interface Address {
  id: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

export interface CheckoutState {
  selectedColor: string | null;
  selectedSize: string | null;
  quantity: number;
  note: string;
  selectedShipping: string | null;
  selectedVoucher: string | null;
  selectedPayment: string | null;
}

export interface PricingInfo {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

// Legacy types for compatibility
export interface ProductVariant {
  id: string;
  name: string;
  image: string;
  stock: number;
  label?: string;
}

export interface ProductSize {
  id: string;
  name: string;
  price: number;
  weight?: number;
  weightRecommendation?: string;
  measurements?: {
    waist?: string;
    hip?: string;
    length?: string;
    inseam?: string;
    bust?: string;
    sleeve?: string;
  };
}

export interface StoreVoucher {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minPurchase: number;
  maxDiscount?: number;
  validUntil: string;
  description: string;
}
