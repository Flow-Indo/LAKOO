'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2, ShoppingCart, MoreVertical } from 'lucide-react';

export default function MobileProductHeader({ cartCount = 0 }: { cartCount?: number }) {
  const router = useRouter();

  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-3 sm:p-4">
      <button
        onClick={() => router.back()}
        className="w-7 h-7 bg-black/40 backdrop-blur-sm rounded-md flex items-center justify-center active:scale-95 transition-transform"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>

      <div className="flex items-center gap-2">
        <button className="w-7 h-7 bg-black/40 backdrop-blur-sm rounded-md flex items-center justify-center active:scale-95 transition-transform">
          <Share2 className="w-4 h-4 text-white" />
        </button>

        <button className="relative w-7 h-7 bg-black/40 backdrop-blur-sm rounded-md flex items-center justify-center active:scale-95 transition-transform">
          <ShoppingCart className="w-4 h-4 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-3 h-3 rounded-full flex items-center justify-center font-semibold text-xs">
              {cartCount}
            </span>
          )}
        </button>

        <button className="w-7 h-7 bg-black/40 backdrop-blur-sm rounded-md flex items-center justify-center active:scale-95 transition-transform">
          <MoreVertical className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

