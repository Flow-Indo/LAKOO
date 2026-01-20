'use client';

import { ShoppingBag, Music } from 'lucide-react';
import type { LiveShop, LiveShopProduct } from '@/types/live-shopping';

interface Props {
  shop: LiveShop;
  product: LiveShopProduct;
  description: string;
}

export function VideoMobileOverlay({ shop, product, description }: Props) {
  return (
    <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
      {/* Product Header */}
      <div className="bg-orange-500 px-4 py-3 flex items-center gap-3">
        <ShoppingBag className="w-5 h-5 text-white" />
        <span className="text-white font-semibold text-sm truncate">
          {product.name}
        </span>
      </div>

      {/* Shop Info */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white font-medium text-sm">
            @{shop.name}
          </span>
        </div>

        <p className="text-white text-sm line-clamp-2 mb-3">
          {description}
        </p>

        {/* Music/Sound */}
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-white" />
          <span className="text-white text-xs">
            Original Sound
          </span>
        </div>
      </div>
    </div>
  );
}