'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/providers/cart-provider';
import { MAIN_NAV_ITEMS, DESKTOP_NAV_ITEMS } from '@/lib/navigation';
import { Separator } from '@/components/ui';
import { cn } from '@/lib/utils';

export function LeftSidebar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const cartData = useCart();
  const cartItemCount = cartData?.items?.length || 0;

  return (
    <div className="hidden md:flex w-64 h-screen sticky top-0 bg-white shadow-xl overflow-y-auto">
      <div className="flex flex-col w-full">
        {/* BRAND SECTION */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-red-50 to-white">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                LAKU
              </span>
              <span className="text-xs text-gray-600 font-medium">
                {t('brand.tagline')}
              </span>
            </div>
          </Link>
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="px-4 py-6">
          <div className="mb-4 px-3">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              Navigation
            </h3>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-2"></div>
          </div>
          <ul className="space-y-1">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const badgeCount = item.id === 'cart' ? cartItemCount : 0;
              const showBadge = item.badge && badgeCount > 0;
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-red-50 to-transparent text-red-600 font-semibold border-l-4 border-red-600 -ml-[1px]"
                        : "text-gray-700 font-normal hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                    <span>{t(item.labelKey)}</span>
                    {showBadge && (
                      <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium">
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* DIVIDER */}
        <Separator className="mx-4" />

        {/* DESKTOP EXTRA NAVIGATION */}
        <div className="px-4 py-4">
          <div className="mb-3 px-3">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              Account
            </h3>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-2"></div>
          </div>
          <ul className="space-y-1">
            {DESKTOP_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-r-lg transition-all duration-200 text-sm",
                      isActive
                        ? "bg-gradient-to-r from-red-50 to-transparent text-red-600 font-semibold border-l-4 border-red-600 -ml-[1px]"
                        : "text-gray-600 font-normal hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive && "stroke-[2.5]")} />
                    <span>{t(item.labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* DIVIDER */}
        <Separator className="mx-4" />

        {/* LANGUAGE TOGGLE */}
        <div className="mt-auto p-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2 font-medium">
            Language / Bahasa
          </p>
          <div className="flex gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setLocale('id')}
              className={cn(
                "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200",
                locale === 'id'
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              ID
            </button>
            <button
              onClick={() => setLocale('en')}
              className={cn(
                "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200",
                locale === 'en'
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}