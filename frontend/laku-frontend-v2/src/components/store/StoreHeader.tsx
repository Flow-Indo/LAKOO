'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2, Heart } from 'lucide-react';
import { useState } from 'react';

interface StoreHeaderProps {
  storeName: string;
}

export default function StoreHeader({ storeName }: StoreHeaderProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Left: Back Button */}
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Center: Store Name */}
        <h1 className="text-base font-semibold text-gray-900 truncate max-w-[200px]">
          {storeName}
        </h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`p-2 rounded-full transition-colors ${
              isFollowing ? 'text-red-500' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${isFollowing ? 'fill-red-500' : ''}`}
            />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
