'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface StoreRecommendationsProps {
  storeId: string;
  products: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    sold?: string;
  }>;
}

export function StoreRecommendations({ storeId, products }: StoreRecommendationsProps) {
  const [active, setActive] = useState<'recommend'|'discount'|'best'|'new'>('recommend');

  const filtered = useMemo(() => {
    const list = [...(products || [])];
    switch (active) {
      case 'best':
        return list.sort((a,b) => {
          const soldA = parseInt(a.sold?.replace(/[^0-9]/g, '') || '0');
          const soldB = parseInt(b.sold?.replace(/[^0-9]/g, '') || '0');
          return soldB - soldA;
        }).slice(0, 6);
      case 'new':
        return list.slice().reverse().slice(0, 6);
      case 'discount':
        return list.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 6);
      case 'recommend':
      default:
        return list.slice(0, 6);
    }
  }, [products, active]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('id-ID');
  };

  const formatSold = (sold: string | undefined) => {
    if (!sold) return '0';
    const num = parseInt(sold.replace(/[^0-9]/g, ''));
    if (sold.includes('K')) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'rb';
    }
    return num.toLocaleString('id-ID');
  };

  return (
    <div className="px-4 py-4 border-t border-gray-200">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => setActive('recommend')}
                className={`text-xs py-2 px-1 font-medium text-center truncate transition-colors ${
                  active === 'recommend' 
                    ? 'border-b-2 border-red-500 text-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Rekomendasi
              </button>
              <button
                onClick={() => setActive('discount')}
                className={`text-xs py-2 px-1 font-medium text-center truncate transition-colors ${
                  active === 'discount' 
                    ? 'border-b-2 border-red-500 text-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Diskon
              </button>
              <button
                onClick={() => setActive('best')}
                className={`text-xs py-2 px-1 font-medium text-center truncate transition-colors ${
                  active === 'best' 
                    ? 'border-b-2 border-red-500 text-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Terlaris
              </button>
              <button
                onClick={() => setActive('new')}
                className={`text-xs py-2 px-1 font-medium text-center truncate transition-colors ${
                  active === 'new' 
                    ? 'border-b-2 border-red-500 text-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Produk Baru
              </button>
            </div>
          </div>

          <Link href={`/store/${storeId}`} className="ml-2 flex-shrink-0 p-1">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Product Grid - 3 columns x 2 rows */}
      <div className="grid grid-cols-3 gap-2">
        {filtered.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              {/* Image Container */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="33vw"
                />
              </div>
              
              {/* Product Info */}
              <div className="p-2">
                <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1.5 leading-tight">
                  {product.name}
                </h4>
                
                {/* Rating and Sold */}
                <div className="flex items-center gap-1 text-[10px] mb-1.5">
                  <div className="flex items-center gap-0.5 text-yellow-400">
                    <span>★</span>
                    <span className="font-medium text-gray-700">{product.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">{formatSold(product.sold)} terjual</span>
                </div>
                
                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-red-600 font-bold text-xs">
                    Rp {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
