'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Star } from 'lucide-react';
import { ProductData, ProductTag } from '@/lib/products-data';

interface TaggedProductsListProps {
  products: Array<ProductData & { tag: ProductTag }>;
}

export default function TaggedProductsList({ products }: TaggedProductsListProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="px-4 py-0 bg-white border-b border-gray-100">
      {/* Products List */}
      <div className="space-y-3">
        {products.map((product, index) => (
          <Link
            key={index}
            href={`/product/${product.slug}`}
            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            {/* Product Thumbnail */}
            <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={product.productImages[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="64px"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-medium text-gray-900 line-clamp-1 mb-0.5">
                {product.brand}
              </h4>
              <p className="text-[12px] text-gray-600 line-clamp-1 mb-1">
                {product.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[#ff2742]">
                  {product.currency} {product.price.toLocaleString('id-ID')}
                </span>
                {product.originalPrice && (
                  <span className="text-[11px] text-gray-400 line-through">
                    {product.currency} {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>

            {/* Star Icon */}
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Star className="w-5 h-5 text-gray-400 hover:text-[#ff2742]" />
            </button>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
