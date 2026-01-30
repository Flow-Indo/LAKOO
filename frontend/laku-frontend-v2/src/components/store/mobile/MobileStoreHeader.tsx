'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Share } from 'lucide-react';
import { Store } from '@/types/store';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileStoreHeaderProps {
  store: Store;
}

export function MobileStoreHeader({ store }: MobileStoreHeaderProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          text: store.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Search Bar (modified for store context) */}
      <div className="flex-1 mx-3">
        <div className="relative">
          <input
            type="text"
            placeholder={`Cari di ${store.name}...`}
            className="w-full h-10 pl-4 pr-10 rounded-xl bg-gray-50 border border-[#C93020] text-sm focus:outline-none focus:ring-0 focus:border-[#C93020]"
            readOnly // For now, make it readonly since search functionality isn't implemented
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Share className="w-5 h-5 text-gray-700" />
      </button>
    </header>
  );
}