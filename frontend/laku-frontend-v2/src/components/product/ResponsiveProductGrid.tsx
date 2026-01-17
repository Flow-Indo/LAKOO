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
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg p-3 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:z-10"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-md mb-2">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      </div>

      {/* Content */}
      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
        {product.name}
      </h3>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-lg font-bold text-red-600">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-xs text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>

      <div className="text-xs text-gray-500">
        {product.sold}+ terjual
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {products.map((product) => (
        <TaobaoProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}