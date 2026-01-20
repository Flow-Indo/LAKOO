'use client';

import { Check, ShoppingBag } from 'lucide-react';
import type { LiveShop } from '@/types/live-shopping';

interface Props {
  shop: LiveShop;
  description: string;
  productName: string;
  onShopClick: () => void;
}

export function VideoShopInfo({ shop, description, productName, onShopClick }: Props) {
  return (
    <div className="absolute bottom-32 left-0 right-16 px-4 z-20">
      {/* Shop Username & Verification */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white font-bold text-base drop-shadow-lg">
          @{shop.name}
        </span>
        {shop.isVerified && (
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-white">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Video Description */}
      <p className="text-white text-sm line-clamp-2 mb-3 drop-shadow-lg">
        {description}
      </p>

      {/* Orange Shop Tag Button */}
      <button
        onClick={onShopClick}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-full hover:bg-orange-600 transition drop-shadow-lg"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        Shop · {productName}
      </button>
    </div>
  );
}