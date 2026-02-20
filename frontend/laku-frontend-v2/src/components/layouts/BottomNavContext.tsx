'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BottomNavContextType {
  hideBottomNav: boolean;
  setHideBottomNav: (hide: boolean) => void;
}

const BottomNavContext = createContext<BottomNavContextType | undefined>(undefined);

export function BottomNavProvider({ children }: { children: ReactNode }) {
  const [hideBottomNav, setHideBottomNav] = useState(false);

  return (
    <BottomNavContext.Provider value={{ hideBottomNav, setHideBottomNav }}>
      {children}
    </BottomNavContext.Provider>
  );
}

export function useBottomNav() {
  const context = useContext(BottomNavContext);
  if (!context) {
    throw new Error('useBottomNav must be used within BottomNavProvider');
  }
  return context;
}
