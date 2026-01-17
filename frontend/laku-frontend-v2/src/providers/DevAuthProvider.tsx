'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function DevAuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setMockUser } = useAuthStore();

  useEffect(() => {
    // Only auto-login in development mode
    if (process.env.NODE_ENV === 'development') {
      // Check if user is already authenticated
      if (!isAuthenticated) {
        console.log('🔧 DEV MODE: Auto-logging in mock user');
        setMockUser();
      }
    }
  }, [isAuthenticated, setMockUser]);

  return <>{children}</>;
}