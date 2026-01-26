export interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: Array<string | { url: string; width?: number; height?: number }>;
  imageTall?: boolean;
  isOfficial?: boolean;
  category: string;
  description: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  sold?: number;
  store: {
    id: string;
    name: string;
    location: string;
  };
  // optional selected variant e.g. "White, XL"
  variant?: string;
}

// Export detailed product types for product pages
export type { Product as DetailedProduct, ProductVariant, ProductSize, ProductSeller, ProductShipping, ProductSpecification, ProductReview, ProductRecommendation, ProductTab, ProductSortOption, ProductFilterOption } from './product';

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: Address;
}

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}