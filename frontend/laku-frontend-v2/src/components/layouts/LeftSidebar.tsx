'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/providers/cart-provider';
import { MAIN_NAV_ITEMS } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import {
  Settings,
  Sun,
  Moon,
  Languages,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function LeftSidebar() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLanguage();
  const cartData = useCart();
  const cartItemCount = cartData?.items?.length || 0;

  const [isMoreExpanded, setIsMoreExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // TODO: Integrate with actual theme system
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Integrate with auth system

  const handleMoreClick = () => {
    setIsMoreExpanded(!isMoreExpanded);
  };

  const handleAppearanceToggle = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual theme switching
    console.log('Theme toggled:', !isDarkMode ? 'dark' : 'light');
  };

  const handleLanguageToggle = () => {
    setLocale(locale === 'id' ? 'en' : 'id');
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      // TODO: Implement logout
      console.log('Logout clicked');
      setIsLoggedIn(false);
    } else {
      // TODO: Navigate to login/register
      console.log('Login/Register clicked');
    }
  };

  return (
    <aside className="w-[245px] md:w-[72px] xl:w-[245px] h-screen overflow-y-auto bg-white sticky top-0 border-r border-gray-100 transition-all duration-300 ease-in-out hidden md:flex flex-col py-10 px-2 md:px-1 xl:px-8">
      <div className="flex flex-col h-full px-2 md:px-1 xl:px-4">
        {/* BRAND SECTION */}
        <div className="mb-12 pb-8 border-b border-gray-100">
          <Link href="/" className="flex items-center justify-center md:justify-center xl:justify-start gap-2 md:gap-1 xl:gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">L</span>
              </div>
          <span className="hidden xl:block text-2xl font-bold text-gray-900">LAKU</span>
          </Link>
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="flex flex-col items-center md:items-center xl:items-start space-y-4 mt-8">
              {MAIN_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const badgeCount = item.id === 'cart' ? cartItemCount : 0;
                const showBadge = item.badge && badgeCount > 0;
                const Icon = item.icon;

          // Special handling for "More" item
          if (item.id === 'more') {
            return (
              <button
                key={item.id}
                onClick={handleMoreClick}
                className={cn(
                  "flex items-center justify-center md:justify-center xl:justify-start w-full gap-3 md:gap-2 xl:gap-6 px-2 md:px-1 xl:px-5 py-4 rounded-xl transition-all duration-200",
                  "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {isMoreExpanded ? (
                  <ChevronUp className="w-6 h-6 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 flex-shrink-0" />
                )}
                <span className="hidden xl:block text-base">{t(item.labelKey)}</span>
              </button>
            );
          }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                "flex items-center justify-center md:justify-center xl:justify-start w-full gap-3 md:gap-2 xl:gap-6 px-2 md:px-1 xl:px-5 py-4 rounded-xl transition-all duration-200",
                      isActive
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
              <Icon className={cn("w-6 h-6 flex-shrink-0", isActive && "text-red-600")} />
              <span className="hidden xl:block text-base">{t(item.labelKey)}</span>
                    {showBadge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-semibold">
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}

        {/* Expanded More Options */}
        {isMoreExpanded && (
          <div className="space-y-2 mt-2">
            {/* Settings */}
            <Link
              href="/settings"
              className="flex items-center justify-center md:justify-center xl:justify-start w-full gap-3 md:gap-2 xl:gap-6 px-2 md:px-1 xl:px-5 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className="hidden xl:block text-sm">{t('nav.settings')}</span>
            </Link>

            {/* Appearance Toggle */}
              <button
              onClick={handleAppearanceToggle}
              className="flex items-center justify-center md:justify-center xl:justify-start w-full gap-3 md:gap-2 xl:gap-6 px-2 md:px-1 xl:px-5 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Moon className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="hidden xl:block text-sm">{t('nav.appearance')}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              className="flex items-center justify-center md:justify-center xl:justify-start w-full gap-3 md:gap-2 xl:gap-6 px-2 md:px-1 xl:px-5 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <Languages className="w-5 h-5 flex-shrink-0" />
              <span className="hidden xl:block text-sm">{t('nav.language')}</span>
              </button>

            {/* Auth Action */}
              <button
              onClick={handleAuthAction}
              className="flex items-center justify-center md:justify-center xl:justify-start w-full gap-3 md:gap-2 xl:gap-6 px-2 md:px-1 xl:px-5 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              {isLoggedIn ? (
                <LogOut className="w-5 h-5 flex-shrink-0" />
              ) : (
                <LogIn className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="hidden xl:block text-sm">
                {isLoggedIn ? t('nav.logout') : t('nav.signin')}
              </span>
            </button>

            {/* Sign Up (only if not logged in) */}
            {!isLoggedIn && (
              <Link
                href="/auth/register"
                className="flex items-center justify-center md:justify-center xl:justify-start w-full gap-3 md:gap-2 xl:gap-6 px-2 md:px-1 xl:px-5 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <UserPlus className="w-5 h-5 flex-shrink-0" />
                <span className="hidden xl:block text-sm">{t('nav.signup')}</span>
              </Link>
            )}
          </div>
        )}
        </nav>
      </div>
    </aside>
  );
}