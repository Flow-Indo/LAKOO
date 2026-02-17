'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { ProductData, ProductTag } from '@/lib/products-data';

interface TaggedProductsListProps {
  products: Array<ProductData & { tag: ProductTag }>;
}

export default function TaggedProductsList({ products }: TaggedProductsListProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="px-2 py-1 bg-white border-b border-gray-100">
      <div className="space-y-3">
        {products.map((product, index) => (
          <div key={index} className="relative">
            {/* Left: Image + Info */}
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group w-full block"
            >
              <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.productImages[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="64px"
                />
              </div>
              <div className="ml-3 flex-1 min-w-0 pr-16 overflow-hidden">
                <h4 className="text-[13px] font-medium text-gray-900 truncate">
                  {product.brand}
                </h4>
                <p 
                  className="text-[12px] text-gray-600 mb-1"
                  style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap'
                  }}
                >
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
            </Link>

            {/* Right: Buttons - absolutely positioned */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-800" />
              </button>
              <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <Star className="w-5 h-5 text-gray-800" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
