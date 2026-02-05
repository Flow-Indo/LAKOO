import type { AxiosInstance } from 'axios';
import { getServiceAuthHeaders } from '../utils/serviceAuth';
import { createHttpClient } from './http';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const AUTH_SERVICE_TIMEOUT_MS = Number(process.env.AUTH_SERVICE_TIMEOUT_MS || 1000);

export type AuthUser = {
  id: string;
  firstName?: string;
  lastName?: string | null;
  phoneNumber: string;
  email?: string | null;
};

export class AuthClient {
  private client: AxiosInstance;

  constructor() {
    this.client = createHttpClient(AUTH_SERVICE_URL, AUTH_SERVICE_TIMEOUT_MS);
  }

  async fetchUser(userId: string): Promise<AuthUser> {
    try {
      const response = await this.client.get(`/api/auth/users/${userId}`, {
        headers: {
          ...getServiceAuthHeaders()
        }
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to fetch user');
      }

      return response.data.data;
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404) {
        throw new Error('User not found');
      }

      const message = error?.response?.data?.error || error?.message || 'Failed to fetch user';
      console.error('AuthClient.fetchUser failed:', { userId, status, message });
      throw new Error(message);
    }
  }
}

export const authClient = new AuthClient();

// Backwards-compatible function export
export async function fetchUser(userId: string): Promise<AuthUser> {
  return authClient.fetchUser(userId);
}
