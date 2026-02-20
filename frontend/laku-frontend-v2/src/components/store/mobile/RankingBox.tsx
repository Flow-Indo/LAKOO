 'use client';

import React, { useState } from 'react';
import RankingProduct from './RankingProduct';
import RankingReview from './RankingReview';
import RankingRating from './RankingRating';
import type { Store } from '@/types/store';

type Props = {
  top?: number;
  className?: string;
  store?: Store;
};

export default function RankingBox({ top = 5, className = '', store }: Props) {
  const [mode, setMode] = useState<'sold' | 'review' | 'rating'>('sold');

  return (
    <div
      className={`rounded-lg overflow-hidden p-4 ${className}`}
      style={{
        background: 'linear-gradient(180deg, #f6e5d7 0%, #ffffff 100%)',
      }}
    >
      <div className="mb-3">
        <div>
          <div className="flex items-center justify-center text-center">
            <button
              onClick={() => setMode('sold')}
              className={`text-xl font-semibold px-2 ${mode === 'sold' ? 'text-[#b5967c]' : 'text-gray-600/30'}`}
            >
              Penjualan
            </button>
            <span className="mx-4 text-gray-300">|</span>
            <button
              onClick={() => setMode('review')}
              className={`text-xl font-semibold px-2 ${mode === 'review' ? 'text-[#b5967c]' : 'text-gray-600/30'}`}
            >
              Review
            </button>
            <span className="mx-4 text-gray-300">|</span>
            <button
              onClick={() => setMode('rating')}
              className={`text-xl font-semibold px-2 ${mode === 'rating' ? 'text-[#b5967c]' : 'text-gray-600/30'}`}
            >
              Rating
            </button>
          </div>

          <div className="mt-6 mb-6 text-sm font-light text-[#b5967c] text-center">
            {mode === 'sold'
              ? 'Ranking berdasarkan penjualan terbanyak'
              : mode === 'review'
              ? 'Ranking berdasarkan review terbanyak'
              : 'Ranking berdasarkan rating tertinggi'}
          </div>
        </div>
      </div>

      {mode === 'sold' ? (
        <RankingProduct top={top} products={store?.products} />
      ) : mode === 'review' ? (
        <RankingReview top={top} products={store?.products} />
      ) : (
        <RankingRating top={top} products={store?.products} />
      )}
    </div>
  );
}

