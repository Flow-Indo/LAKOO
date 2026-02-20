'use client';

import React from 'react';
import CarouselVerOne from './CarouselVerOne';
import RankingBox from './RankingBox';
import type { Store } from '@/types/store';

export function MobileStoreBody({ images, store }: { images: string[]; store?: Store }) {

  return (
    <div
      className="pt-4 px-4 pb-0 rounded-t-xl overflow-visible bg-white relative z-10 shadow-none flex flex-col"
      style={{ gap: '10px' }}
    >
      <CarouselVerOne images={images} height="60vh" />

      <RankingBox top={3} store={store} />
     
      {/* Centered divider with 'Produk' label (gradient lines) */}
      <div className="w-full flex items-center justify-center my-1">
        <div
          style={{ width: '28%', height: '1px', background: 'linear-gradient(to left, #FF6A00 0%, #FFFFFF 100%)' }}
        />
        <span style={{ margin: '0 12px' }} className="text-red-600 font-semibold">Produk</span>
        <div
          style={{ width: '28%', height: '1px', background: 'linear-gradient(to right, #FF6A00 0%, #FFFFFF 100%)' }}
        />
      </div>

    </div>
 
  );
}