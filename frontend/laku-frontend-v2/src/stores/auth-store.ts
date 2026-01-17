import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  // Development bypass
  setMockUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      // Development bypass function
      setMockUser: () => {
        const mockUser: User = {
          id: 'dev-user-001',
          name: 'User LAKU',
          email: 'user@laku.id',
          avatar: undefined,
          createdAt: '2024-01-01T00:00:00Z',
        };
        const mockToken = 'dev-token-' + Date.now();
        set({ user: mockUser, token: mockToken, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);