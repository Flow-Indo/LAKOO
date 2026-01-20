'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductShowcase } from './ProductShowcase';
import type { LiveShopProduct } from '@/types/live-shopping';

interface Props {
  products: LiveShopProduct[];
  shopId: string;
  initialIndex?: number;
}

export function ProductCarousel({ products, shopId, initialIndex = 0 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (products.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative">

      {/* Product Showcase */}
      <ProductShowcase
        product={products[currentIndex]}
        shopId={shopId}
      />

      {/* Navigation (if multiple products) */}
      {products.length > 1 && (
        <>
          {/* Product Counter */}
          <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-semibold border border-white/20">
            {currentIndex + 1} / {products.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute bottom-60 left-4 z-30 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition border border-white/20"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute bottom-60 right-4 z-30 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition border border-white/20"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-44 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition border ${
                  index === currentIndex
                    ? 'w-6 h-1.5 bg-white border-white/50'
                    : 'w-1.5 h-1.5 bg-white/30 border-white/20'
                }`}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
}