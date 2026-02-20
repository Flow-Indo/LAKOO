// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// Route paths
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER: (id: string) => `/orders/${id}`,
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  CART: 'lakoo_cart',
  USER: 'lakoo_user',
  TOKEN: 'lakoo_token',
} as const;

// Common constants
export const ITEMS_PER_PAGE = 12;
export const MAX_CART_ITEMS = 99;

// Product categories
export const CATEGORIES = [
  'electronics',
  'clothing',
  'home',
  'sports',
  'books',
  'beauty',
  'toys',
  'automotive'
] as const;

// Order status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Payment methods
export const PAYMENT_METHODS = [
  'credit_card',
  'debit_card',
  'bank_transfer',
  'e_wallet',
  'cash_on_delivery'
] as const;