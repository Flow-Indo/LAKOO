 'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockStore } from '@/lib/mock-store-data';
import { formatPrice } from '@/lib/formatters';
import type { StoreProduct } from '@/types/store';

type Props = {
  top?: number;
};

export default function RankingProduct({ top = 5 }: Props) {
  const products: StoreProduct[] = (mockStore && mockStore.products) || [];
  const ranked = products
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
            <div className="relative w-40 h-40 rounded overflow-hidden flex-shrink-0">
              <Image src={p.image} alt={p.name} fill className="object-cover" />
              <div
                className={`absolute top-2 left-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  i === 0 ? 'bg-amber-200 text-amber-800' : 'bg-amber-100 text-amber-700'
                }`}
              >
                TOP {i + 1}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">{p.name}</h3>

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
                <div className="text-red-600 font-bold text-xl">{formatPrice(p.price)}</div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

