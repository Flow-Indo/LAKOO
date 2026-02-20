'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/products-data';

interface SearchResultsProductsProps {
  query: string;
}

export default function SearchResultsProducts({ query }: SearchResultsProductsProps) {
  const [activeFilter, setActiveFilter] = useState('unggulan');

  const filters = [
    { id: 'unggulan', label: 'Unggulan' },
    { id: 'toko', label: 'Toko' },
    { id: 'sale', label: 'Sale' },
    { id: 'terlaris', label: 'Terlaris' }
  ];

  // Get products
  const products = [
    getProductBySlug('cult-suri'),
    getProductBySlug('karakiri'),
    getProductBySlug('rue'),
    getProductBySlug('wearthreek')
  ].filter(Boolean);

  return (
    <div className="bg-white min-h-screen">
      {/* Filter Pills - MOBILE OPTIMIZED */}
      <div className="sticky top-[109px] z-30 bg-white px-3 py-3 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-shrink-0 h-9 px-4 rounded-full text-[14px] font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-[#F7F8FA] text-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products List - MOBILE OPTIMIZED */}
      <div className="px-3 py-4">
        <div className="space-y-3">
          {products.map((product: any) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="block p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={product.images?.[0] || '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor1.webp'}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Product Name */}
                  <h3 className="text-sm text-gray-700 leading-tight line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Price and Sales */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-semibold text-[#FF2442]">
                      Rp{product.price?.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-gray-400">
                      {product.productData?.sold || '500+'}
                    </span>
                  </div>

                  {/* Store Info */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 bg-gray-200 rounded-full flex-shrink-0" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide">
                      {product.brand || 'Store'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
