 'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface StoreRecommendationsProps {
  storeId: string;
  products: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    sold: number;
  }>;
}

export function StoreRecommendations({ storeId, products }: StoreRecommendationsProps) {
  const [active, setActive] = useState<'recommend'|'discount'|'best'|'new'>('recommend');

  const filtered = useMemo(() => {
    const list = [...(products || [])];
    switch (active) {
      case 'best':
        return list.sort((a,b) => (b.sold || 0) - (a.sold || 0)).slice(0,6);
      case 'new':
        return list.slice().reverse().slice(0,6);
      case 'discount':
        // no discount data in mock - fallback to first items
        return list.slice(0,6);
      case 'recommend':
      default:
        return list.slice(0,6);
    }
  }, [products, active]);

  return (
    <div className="px-4 py-4 border-t border-gray-200">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-3">
        <div className="flex items-center justify-between px-3">
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => setActive('recommend')}
                className={`text-xs py-1 px-2 font-medium text-center truncate ${active === 'recommend' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}
              >
                Rekomendasi
              </button>
              <button
                onClick={() => setActive('discount')}
                className={`text-xs py-1 px-2 font-medium text-center truncate ${active === 'discount' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}
              >
                Diskon
              </button>
              <button
                onClick={() => setActive('best')}
                className={`text-xs py-1 px-2 font-medium text-center truncate ${active === 'best' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}
              >
                Best Seller
              </button>
              <button
                onClick={() => setActive('new')}
                className={`text-xs py-1 px-2 font-medium text-center truncate ${active === 'new' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}
              >
                Produk Baru
              </button>
            </div>
          </div>

          <Link href={`http://localhost:3000/store/${storeId}`} className="ml-3 flex-shrink-0">
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </Link>
        </div>
      </div>

      {/* Product Grid - 3 columns */}
      <div className="grid grid-cols-3 gap-2">
        {filtered.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
              <div className="p-2">
                <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1 break-words">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-red-600 font-bold text-sm">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Terjual {product.sold}+</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

