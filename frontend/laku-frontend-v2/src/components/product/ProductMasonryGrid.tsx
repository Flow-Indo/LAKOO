'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatters';

interface ProductMasonryGridProps {
  products: Product[];
}

interface MasonryProductCardProps {
  product: Product;
}

function MasonryProductCard({ product }: MasonryProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Create deterministic heights for masonry effect based on product ID
  const getMasonryHeight = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const height = 300 + (hash % 5) * 50; // Heights between 300-500px
    return height;
  };

  return (
    <Link href={`/products/${product.slug}`} className="block mb-2 sm:mb-3 break-inside-avoid">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        {/* Product Image - Variable Height */}
        <div className="relative w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={getMasonryHeight(product.id)} // Deterministic height for masonry effect
            className={`w-full h-auto object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 50vw, 25vw"
            priority={false}
          />

          {/* Discount Badge */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
              -{product.discount}%
            </div>
          )}

          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>

        {/* Product Info */}
        <div className="p-2">
          {/* Product Name - 2 lines max */}
          <h3 className="text-sm font-normal text-gray-900 line-clamp-2 mb-1 leading-tight">
            {product.name}
          </h3>

          {/* Price - Large, bold, red */}
          <div className="mb-1">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through ml-1">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Sold Count */}
          <div className="text-xs text-gray-500 mb-1">
            {product.sold || 0} terjual
          </div>

          {/* Store Name */}
          <div className="text-xs text-gray-500 truncate">
            {product.store.name}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductMasonryGrid({ products }: ProductMasonryGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Tidak ada produk ditemukan</div>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-2 sm:gap-3 space-y-2 sm:space-y-3">
      {products.map((product) => (
        <MasonryProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}