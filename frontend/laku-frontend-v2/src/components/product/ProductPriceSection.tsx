'use client';

import { Star } from 'lucide-react';

interface Props {
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  rating: number;
  reviewCount: number;
}

export function ProductPriceSection({
  price,
  originalPrice,
  discount,
  currency,
  rating,
  reviewCount,
}: Props) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white px-4 py-6">
      {/* Price Section */}
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-bold text-red-600">
          {formatPrice(price)}
        </span>

        {originalPrice && originalPrice > price && (
          <span className="text-lg text-gray-500 line-through">
            {formatPrice(originalPrice)}
          </span>
        )}

        {discount && discount > 0 && (
          <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Rating Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : star - 0.5 <= rating
                    ? 'fill-yellow-400/50 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-900 ml-1">
            {rating}
          </span>
        </div>

        <span className="text-sm text-gray-600">
          ({reviewCount.toLocaleString()} reviews)
        </span>

        <span className="text-sm text-green-600 font-medium">
          ✓ Verified Purchase
        </span>
      </div>
    </div>
  );
}