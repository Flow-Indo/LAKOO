'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function StickyHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleImageSearch = () => {
    // TODO: Implement image search functionality
    console.log('Image search clicked');
  };

  return (
    <div className="w-full sticky top-0 z-50 bg-white border-b border-gray-200 pt-safe mb-6">
      {/* ROW 1: Search Bar */}
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 py-4">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('action.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleImageSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>


    </div>
  );
}