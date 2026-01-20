'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ProductRecommendation } from '@/types/product';

interface Props {
  recommendations: ProductRecommendation[];
}

export function ProductSellerProducts({ recommendations }: Props) {
  const router = useRouter();

  const handleViewAll = () => {
    router.push('/seller/products'); // In real app, this would be dynamic
  };

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">More from this seller</h3>
        <button
          onClick={handleViewAll}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {recommendations.slice(0, 4).map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/product/${product.id}`)}
            className="cursor-pointer group"
          >
            <div className="relative aspect-square mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
              />
              {product.discount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  -{product.discount}%
                </div>
              )}
              {product.seller.isTrending && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded">
                  Trending
                </div>
              )}
            </div>

            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
              {product.name}
            </h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-gray-900">
                  Rp{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    Rp{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600">{product.sold} sold</span>
            </div>

            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating)
                        ? 'bg-yellow-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">({product.rating})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}