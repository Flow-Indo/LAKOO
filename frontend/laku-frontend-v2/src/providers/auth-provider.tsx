'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, token, setAuth, logout: storeLogout, isAuthenticated } = useAuthStore();

  // You could add additional loading states here if needed
  // For now, we'll assume auth state is immediately available from Zustand

  const login = (user: User, token: string) => {
    setAuth(user, token);
  };

  const logout = () => {
    storeLogout();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading: false, // Could be enhanced with actual loading states
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protected routes
export function withAuth<T extends object>(
  Component: React.ComponentType<T>
) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuth();

    // You could show a loading spinner here
    if (isLoading) {
      return <div>Loading...</div>;
    }

    // You could redirect to login page here
    if (!isAuthenticated) {
      return <div>Please log in to access this page</div>;
    }

    return <Component {...props} />;
  };
}