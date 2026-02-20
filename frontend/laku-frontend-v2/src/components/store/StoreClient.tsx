'use client';

import { useState, useEffect } from 'react';
import { Store } from '@/types/store';
import { MobileStorePage } from './mobile/MobileStorePage';
import { DesktopStorePage } from './desktop/DesktopStorePage';

interface StoreClientProps {
  store: Store;
}

export function StoreClient({ store }: StoreClientProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // For SSR, default to desktop and then switch on client
  if (typeof window === 'undefined') {
    return <DesktopStorePage store={store} />;
  }

  return isMobile ? (
    <MobileStorePage store={store} />
  ) : (
    <DesktopStorePage store={store} />
  );
}