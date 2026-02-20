'use client';

import { X, Truck } from 'lucide-react';
import type { LiveProduct } from '@/types/live-stream';

interface Props {
  product: LiveProduct;
  onClose?: () => void;
  onBuy?: () => void;
}

export function LiveProductCard({ product, onClose, onBuy }: Props) {
  const discountPercentage = product.discount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="absolute bottom-20 left-4 right-4 z-40">
      <div className="bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-4">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          {product.cardNumber && (
            <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {product.cardNumber.toString().padStart(2, '0')}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-semibold text-sm line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <Truck className="w-3 h-3 text-green-600" />
            <span className="text-green-600 text-xs font-medium">Free shipping</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-900 font-bold text-lg">
              Rp{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-gray-500 text-sm line-through">
                Rp{product.originalPrice.toLocaleString()}
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-semibold">
                -{discountPercentage}%
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBuy}
            className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-red-600 transition"
          >
            Buy
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}