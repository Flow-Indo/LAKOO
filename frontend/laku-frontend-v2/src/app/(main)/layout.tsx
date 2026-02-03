'use client';

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/layouts/BottomNav';
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hide bottom navigation on store pages and product pages
  const isStorePage = pathname?.startsWith('/store/');
  const isProductPage = pathname?.startsWith('/product/');

  return (
    <div className="min-h-screen bg-gray-50 px-0">
      <main>
        {children}
      </main>
      {isMounted && !isStorePage && !isProductPage && <BottomNav />}
    </div>
  );
}
