export type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'paid'
  | 'confirmed'
  | 'processing'
  | 'ready_to_ship'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export type OrderSource = 'brand' | 'seller' | 'live_commerce';

export interface CheckoutOrderDTO {
  // Gateway calls derive userId from auth headers; internal calls must supply it.
  userId?: string;
  idempotencyKey: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  shippingAddressId?: string;
  shippingAddress: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district?: string;
    postalCode?: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  shippingNotes?: string;
  discountAmount?: number;
  shippingCost?: number;
  taxAmount?: number;
  paymentMethod?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface UpdateOrderStatusDTO {
  orderId: string;
  newStatus: OrderStatus;
  reason?: string;
  notes?: string;
  metadata?: Record<string, any>;
  changedBy?: string;
  changedByType?: 'customer' | 'admin' | 'system' | 'service';
}

export interface OrderFilters {
  userId?: string;
  sellerId?: string;
  orderSource?: OrderSource;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
}
