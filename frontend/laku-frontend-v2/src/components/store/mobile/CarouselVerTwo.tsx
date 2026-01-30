 'use client';

import React, { useRef, useState } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function CarouselVerTwo({ items }: { items?: any[] }) {
  // default minimal items (only image, price, rating, discount)
  const defaultProducts = [
    { id: '1', image: '/jeans/jean_mock_images/reviews2.JPG', price: 89000, rating: 4.2, discount: 31 },
    { id: '2', image: '/jeans/jean_mock_images/reviews3.JPG', price: 299000, rating: 4.0, discount: 0 },
    { id: '3', image: '/jeans/jean_mock_images/reviews4.JPG', price: 176000, rating: 4.5, discount: 0 },
  ];

  const productList = items && items.length > 0 ? items : defaultProducts;
  const displayList = [...productList, ...productList];
  // helper: build full Product expected by ProductCard from minimal data
  function toProduct(x: any): Product {
    return {
      id: String(x.id),
      name: x.name || '',
      slug: x.slug || `p-${x.id}`,
      image: x.image || '/jeans/jean_mock_images/reviews2.JPG',
      price: typeof x.price === 'number' ? x.price : parseInt(String(x.price || '0').replace(/[^\d]/g, '')) || 0,
      originalPrice: x.originalPrice || 0,
      discount: x.discount || 0,
      images: x.images || [x.image || '/jeans/jean_mock_images/reviews2.JPG'],
      category: x.category || '',
      description: x.description || '',
      stock: x.stock || 0,
      rating: x.rating || 0,
      reviewCount: x.reviewCount || 0,
      
      store: x.store || { id: 's0', name: '', location: '', type: 'NoBadge' },
    } as Product;
  }
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full rounded-lg overflow-hidden relative">
      {/* static background image using plain img to avoid next/image import here */}
      <div className="w-full h-80 sm:h-[40vh] relative bg-gray-100">
        <img src="/jeans/jean_mock_images/reviews1.JPG" alt="banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* bottom strip: auto-scrolling product carousel */}
        <div className="absolute left-0 right-0 bottom-0 p-3">
          <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            ref={wrapperRef}
          >
            <div
              className="flex gap-3 will-change-transform items-stretch"
              style={{
                display: 'flex',
                alignItems: 'stretch',
                animation: `${isPaused ? 'none' : 'marquee'} 16s linear infinite`,
              }}
            >
              {displayList.map((p, i) => {
                const prod = toProduct(p);
                return (
                  <div key={`${prod.id}-${i}`} className="flex-shrink-0 w-44 sm:w-48">
                    <ProductCard product={prod} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* inline keyframes for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

