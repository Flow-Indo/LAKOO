'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function DevAuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setMockUser } = useAuthStore();
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  useEffect(() => {
    // Always auto-login for testing purposes (works on Vercel too)
    // This bypasses authentication for easy testing
    if (!isAuthenticated && !hasLoggedIn) {
      console.log('🔧 DEV MODE: Auto-logging in mock user for testing');
      setMockUser();
      setHasLoggedIn(true);
    }
  }, [isAuthenticated, setMockUser, hasLoggedIn]);

  return <>{children}</>;
}