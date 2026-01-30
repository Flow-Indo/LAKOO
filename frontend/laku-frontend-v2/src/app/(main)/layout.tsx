'use client';

import { BottomNav } from '@/components/layouts/BottomNav';
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = typeof window !== 'undefined' ? usePathname() : null;
  
  // Hide bottom navigation on store pages
  const isStorePage = pathname?.startsWith('/store/');

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {children}
      </main>
      {!isStorePage && <BottomNav />}
    </div>
  );
}
