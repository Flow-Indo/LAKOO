'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function EmptyState() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 px-4 py-12">
      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3h18v2H3z" fill="#f3f4f6"/>
          <path d="M6 7h12l-1 10H7L6 7z" fill="#fff"/>
          <path d="M9 19a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" fill="#d1d5db"/>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{t('cart.title')}</h2>
      <p className="text-sm text-gray-600 max-w-sm text-center mb-4">{t('cart.empty_message')}</p>
      <Link href="/" className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700">
        {t('cart.shop_now')}
      </Link>
    </div>
  );
}

