'use client';

import { ShoppingCart } from 'lucide-react';
import type { LiveShopProduct } from '@/types/live-shopping';

interface Props {
  product: LiveShopProduct;
  onAddToCart: () => void;
}

export function VideoProductShowcase({ product, onAddToCart }: Props) {
  return (
    <div className="absolute bottom-4 left-0 right-0 px-4 z-20">
      <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
        />

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-sm font-medium truncate drop-shadow-lg">
            {product.name}
          </h3>
          <p className="text-white text-lg font-bold drop-shadow-lg">
            Rp{product.price.toLocaleString()}
          </p>
        </div>

        {/* Buy Button */}
        <button
          onClick={onAddToCart}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition flex-shrink-0"
        >
          <ShoppingCart className="w-4 h-4" />
          Buy
        </button>
      </div>
    </div>
  );
}