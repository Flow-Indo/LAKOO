'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@/contexts/ChatContext';
import { useCartStore } from '@/stores/cart-store';
import { MAIN_NAV_ITEMS } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isInChat } = useChat();
  const cartCount = useCartStore(state => state.getTotalItems());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Filter out "more" item from mobile navigation
  const mobileNavItems = MAIN_NAV_ITEMS.filter(item => item.id !== 'more');

  // Hide bottom nav only when in chat conversation
  if (isInChat) {
    return null;
  }

  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50 pb-safe-bottom">
      <div className="grid grid-cols-5 py-2 w-full">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const badgeCount = item.id === 'cart' ? cartCount : 0;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 relative transition-transform duration-200",
                isActive && "scale-105"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-6 h-6",
                    isActive ? "text-red-600 stroke-[2.5]" : "text-gray-600"
                  )}
                />
                {item.badge && isHydrated && badgeCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {badgeCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 transition-colors duration-200",
                  isActive ? "text-red-600 font-semibold" : "text-gray-600"
                )}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}