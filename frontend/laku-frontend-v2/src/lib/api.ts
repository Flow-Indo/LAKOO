import { Product, Order, User } from '@/types';
import { API_BASE_URL } from '@/constants';

// Generic API response handler
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// Products API
export const productsApi = {
  async getAll(params?: { category?: string; limit?: number; offset?: number }): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.set('category', params.category);
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.offset) queryParams.set('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
    return handleApiResponse<Product[]>(response);
  },

  async getById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleApiResponse<Product>(response);
  },

  async getBySlug(slug: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`);
    return handleApiResponse<Product>(response);
  },

  async search(query: string): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    return handleApiResponse<Product[]>(response);
  },
};

// Orders API
export const ordersApi = {
  async getAll(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleApiResponse<Order[]>(response);
  },

  async getById(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleApiResponse<Order>(response);
  },

  async create(orderData: Partial<Order>): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(orderData),
    });
    return handleApiResponse<Order>(response);
  },
};

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleApiResponse<{ user: User; token: string }>(response);
  },

  async register(userData: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleApiResponse<{ user: User; token: string }>(response);
  },

  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleApiResponse<User>(response);
  },
};