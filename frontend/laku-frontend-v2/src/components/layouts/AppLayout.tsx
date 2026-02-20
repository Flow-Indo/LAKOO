'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { LeftSidebar } from './LeftSidebar';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export function AppLayout({ children, hideBottomNav = false }: AppLayoutProps) {
  const pathname = usePathname();

  // Hide bottom navigation on product and store pages, or when explicitly hidden
  const isProductPage = pathname?.startsWith('/product/');
  const isStorePage = pathname?.startsWith('/store/');

  return (
    <div className="w-full min-h-screen bg-white">
      <div className={`grid grid-cols-1 md:grid-cols-[72px_1fr] xl:grid-cols-[245px_1fr] ${isProductPage ? '' : 'h-screen'}`}>
        <LeftSidebar />
        <main className={`bg-white ${isProductPage ? 'overflow-y-auto' : 'overflow-y-auto'}`}>
          {children}
        </main>
        {!isProductPage && !isStorePage && !hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}