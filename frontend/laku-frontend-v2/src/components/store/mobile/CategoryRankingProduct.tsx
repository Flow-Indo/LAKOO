'use client';

import React from 'react';
import Image from 'next/image';
import { mockStore } from '@/lib/mock-store-data';
import { formatPrice } from '@/lib/formatters';
import type { StoreProduct } from '@/types/store';

type Props = {
  top?: number;
  category?: string | null;
  products?: StoreProduct[];
};

export default function CategoryRankingProduct({ top = 10, category, products }: Props) {
  const productsList: StoreProduct[] = products && products.length ? products : (mockStore && mockStore.products) || [];

  // Filter by category if provided (case-insensitive)
  const filteredByCategory = category
    ? productsList.filter((p) => String(p.category).toLowerCase() === String(category).toLowerCase())
    : productsList;

  // No ranking — just take filtered products (preserve provided order)
  const displayed = filteredByCategory.slice(0, top);

  return (
    <>
      {displayed.map((p, i) => (
        <div
          key={p.id}
          className="block"
          style={{
            marginBottom: i === 0 ? '10px' : '10px',
            marginTop: i === 0 ? '5px' : '5px',
          }}
        >
          <div className="flex gap-4 items-stretch rounded-lg overflow-hidden p-0 bg-white border border-gray-100">
            {/* Left: fixed-size image */}
            <div className="w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden">
              <Image src={p.image} alt={p.name} width={100} height={100} className="object-cover w-full h-full" />
            </div>

            {/* Right: product info */}
            <div className="flex-1 flex flex-col justify-between px-[1px] pt-[5px] pb-[5px] min-w-0">
              <div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{p.name}</h3>

                <div className="flex items-center gap-1 text-xs">
                  <span className="text-yellow-400">★</span>
                  <span className="font-medium text-gray-700">{p.rating ?? '-'}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">{String(p.sold)} terjual</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-red-600 font-semibold text-base">{formatPrice(p.price)}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

