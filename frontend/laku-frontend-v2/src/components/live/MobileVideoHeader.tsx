'use client';

import { ArrowLeft, Search, Tv } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

export function MobileVideoHeader({ selectedCategory, onCategoryChange }: Props) {
  const router = useRouter();

  return (
    <div className="fixed top-6 left-0 right-0 z-40 bg-transparent md:hidden">
      {/* Single Row Header */}
      <div className="flex items-center px-4 py-4 gap-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="p-3 text-white hover:text-white/80 transition flex-shrink-0"
        >
          <ArrowLeft className="w-7 h-7 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
        </button>

        {/* LIVE Button */}
        <button
          onClick={() => router.push('/live')}
          className="p-3 text-white hover:text-white/80 transition flex-shrink-0"
        >
          <Tv className="w-7 h-7 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
        </button>

        {/* Category Tabs - Scrollable */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "text-base font-medium whitespace-nowrap transition relative pb-1",
                  selectedCategory === category.id
                    ? "text-white font-bold"
                    : "text-white/80 hover:text-white"
                )}
              >
                {category.label}
                {selectedCategory === category.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={() => router.push('/search')}
          className="p-3 text-white hover:text-white/80 transition flex-shrink-0"
        >
          <Search className="w-7 h-7 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
        </button>
      </div>
    </div>
  );
}