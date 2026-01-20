'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatters';

interface ResponsiveProductGridProps {
  products: Product[];
}

interface TaobaoProductCardProps {
  product: Product;
}

function TaobaoProductCard({ product }: TaobaoProductCardProps) {
  const imageSrc = product.image && product.image.trim() !== '' ? product.image : '/placeholder-image.jpg';

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg p-4 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:z-10"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-md mb-3">
        {imageSrc !== '/placeholder-image.jpg' ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-sm">No Image</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
        {product.name}
      </h3>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-red-600">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-xs text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>

          <div className="text-xs text-gray-500 leading-relaxed">
        {product.sold}+ terjual
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ResponsiveProductGrid({ products }: ResponsiveProductGridProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Tidak ada produk ditemukan</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {products.map((product, index) => (
        <TaobaoProductCard key={`${product.id}-${product.slug}-${index}`} product={product} />
      ))}
    </div>
  );
}