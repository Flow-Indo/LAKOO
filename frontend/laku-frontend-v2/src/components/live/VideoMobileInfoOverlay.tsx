'use client';

import { ShoppingBag, Music } from 'lucide-react';
import type { LiveShop, LiveShopProduct } from '@/types/live-shopping';

interface Props {
  shop: LiveShop;
  product: LiveShopProduct;
  description: string;
}

export function VideoMobileInfoOverlay({ shop, product, description }: Props) {
  return (
    <div className="md:hidden fixed bottom-24 left-4 z-40 space-y-3" style={{ maxWidth: '60vw' }}>
        {/* Product Header */}
        <div className="bg-gray-900/60 rounded-md px-2 py-1 flex items-center gap-2 w-fit">
          <div className="bg-orange-500 rounded p-0.5">
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">
            {product.name}
          </span>
        </div>

        {/* Shop Name */}
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm drop-shadow-lg">
            @{shop.name}
          </span>
        </div>

        {/* Caption */}
        <p className="text-white text-sm line-clamp-2 leading-relaxed drop-shadow-lg">
          {description}
        </p>

        {/* Music/Sound */}
        <div className="flex items-center gap-2 pt-1">
          <Music className="w-4 h-4 text-white drop-shadow-lg" />
          <span className="text-white text-xs drop-shadow-lg">
            Original Sound
          </span>
        </div>
    </div>
  );
}