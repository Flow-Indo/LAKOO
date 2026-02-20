'use client';

import { useState } from 'react';
import SearchResultsAll from './SearchResultsAll';
import SearchResultsUsers from './SearchResultsUsers';
import SearchResultsProducts from './SearchResultsProducts';
import { Menu } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  activeTab: 'all' | 'users' | 'products' | 'images';
  onTabChange: (tab: 'all' | 'users' | 'products' | 'images') => void;
}

export default function SearchResults({
  query,
  activeTab,
  onTabChange
}: SearchResultsProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Tabs - MOBILE OPTIMIZED */}
      <div className="sticky top-[49px] z-40 bg-white border-b border-gray-100">
        <div className="flex items-center overflow-x-auto no-scrollbar">
          {/* Menu Icon */}
          <button className="flex-shrink-0 px-2.5 py-3">
            <Menu className="w-5 h-5 text-gray-700" strokeWidth={2} />
          </button>

          {/* Tab Buttons */}
          <div className="flex flex-1 min-w-0">
            <button
              onClick={() => onTabChange('all')}
              className={`flex-shrink-0 px-3 py-3 text-[15px] font-medium transition-colors relative ${
                activeTab === 'all'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              Semua
              {activeTab === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>

            <button
              onClick={() => onTabChange('users')}
              className={`flex-shrink-0 px-3 py-3 text-[15px] font-medium transition-colors relative ${
                activeTab === 'users'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              Pengguna
              {activeTab === 'users' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>

            <button
              onClick={() => onTabChange('products')}
              className={`flex-shrink-0 px-3 py-3 text-[15px] font-medium transition-colors relative ${
                activeTab === 'products'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              Produk
              {activeTab === 'products' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>

            <button
              onClick={() => onTabChange('images')}
              className={`flex-shrink-0 px-3 py-3 text-[15px] font-medium transition-colors relative ${
                activeTab === 'images'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              Gambar
              {activeTab === 'images' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-20">
        {activeTab === 'all' && <SearchResultsAll query={query} />}
        {activeTab === 'users' && <SearchResultsUsers query={query} />}
        {activeTab === 'products' && <SearchResultsProducts query={query} />}
        {activeTab === 'images' && <SearchResultsAll query={query} />}
      </div>
    </div>
  );
}
