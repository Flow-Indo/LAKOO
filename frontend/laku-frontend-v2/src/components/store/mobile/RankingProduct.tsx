 'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockStore } from '@/lib/mock-store-data';
import { formatPrice } from '@/lib/formatters';
import type { StoreProduct } from '@/types/store';

type Props = {
  top?: number;
  products?: StoreProduct[];
};

export default function RankingProduct({ top = 5, products }: Props) {
  const productsList: StoreProduct[] = products && products.length ? products : (mockStore && mockStore.products) || [];
  const ranked = productsList
    .slice()
    .sort((a, b) => {
      const as = typeof a.sold === 'number' ? a.sold : parseFloat(String(a.sold || '0')) || 0;
      const bs = typeof b.sold === 'number' ? b.sold : parseFloat(String(b.sold || '0')) || 0;
      return bs - as;
    })
    .slice(0, top);

  return (
    <div style={{ background: 'transparent' }}>
      {ranked.map((p, i) => (
        <Link
          key={p.id}
          href={`/products/${p.id}`}
          className="block"
          style={{ marginBottom: i === 0 ? '10px' : '10px',
            marginTop: i === 0 ? '15px' : '15px'
           
          }}
        >
          <div className="flex gap-4 items-stretch">
            <div className="relative w-[120px] h-[120px] rounded overflow-hidden flex-shrink-0">
              <Image src={p.image} alt={p.name} fill className="object-cover" />
              
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{p.name}</h3>

                <div className="text-sm text-gray-500 space-y-1">
                
                  <div className="flex items-center gap-2">
                    <div className="relative inline-block" aria-hidden>
                      <div className="text-gray-300">★★★★★</div>
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${(Math.min(p.rating ?? 0, 5) / 5) * 100}%` }}
                      >
                        <div className="text-yellow-500">★★★★★</div>
                      </div>
                    </div>
                    <div className="text-gray-800">{p.rating ?? '-'}</div>
                    <div className="text-gray-500">({p.reviewCount ?? 0})</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Terjual</span>{' '}
                    <span className="text-orange-600">{String(p.sold)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-red-600 font-semibold text-base">{formatPrice(p.price)}</div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

