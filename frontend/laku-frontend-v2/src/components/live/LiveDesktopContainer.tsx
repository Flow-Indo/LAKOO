'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
  children: ReactNode;
}

export function LiveDesktopContainer({ children }: Props) {
  const pathname = usePathname();
  const isLivePage = pathname === '/video';

  if (!isLivePage) return <>{children}</>;

  return (
    <>
      {/* Desktop/Tablet: Mobile-like Rectangle in Center */}
      <div className="hidden md:flex h-screen items-center justify-center bg-white">
        <div className="relative w-[375px] h-[667px] bg-black rounded-3xl overflow-hidden shadow-2xl">
          {children}
        </div>

        {/* Action Buttons - Outside the Mobile Rectangle */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
          {/* This will be populated by LiveActionBar */}
        </div>
      </div>

      {/* Mobile: Full Screen (Existing Behavior) */}
      <div className="md:hidden">
        {children}
      </div>
    </>
  );
}