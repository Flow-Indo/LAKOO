'use client';

import { useState } from 'react';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { cn } from '@/lib/utils';
import type { LiveCategory } from '@/types/live-shopping';

const categories: { id: LiveCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'following', label: 'Following' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'electronics', label: 'Electronic' },
];

interface Props {
  selectedCategory: LiveCategory;
  onCategoryChange: (category: LiveCategory) => void;
}

export function LiveNavBar({ selectedCategory, onCategoryChange }: Props) {
  const router = useRouter();
  const cartCount = useCartStore(state => state.items.length);

  return (
    <div className="fixed top-0 left-0 md:left-[72px] xl:left-[245px] right-0 z-40 md:hidden">

      {/* STRONGER Background Overlay - Maximum visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-black/60 backdrop-blur-xl" />

      {/* Content Layer */}
      <div className="relative">

        {/* Top Row - Back, Search, Cart */}
        <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/20 rounded-full transition"
        >
          <ArrowLeft className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/search')}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <Search className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
          </button>

          <button
            onClick={() => router.push('/cart')}
            className="p-2 hover:bg-white/20 rounded-full transition relative"
          >
            <ShoppingCart className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 px-4 pb-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition",
                "shadow-lg", // Add shadow to buttons
                selectedCategory === category.id
                  ? "bg-white text-black shadow-xl" // Selected: white bg, black text
                  : "bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" // Not selected: semi-transparent with strong shadow
              )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}