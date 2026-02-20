'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { ProductData } from '@/lib/products-data';

interface StoreProductsProps {
  products: ProductData[];
  storeName: string;
  categories: string[];
}

export default function StoreProducts({
  products,
  storeName,
  categories
}: StoreProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products; // Add category filtering logic if needed

  return (
    <div className="py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Produk {storeName}
        </h2>
        <span className="text-sm text-gray-500">
          {products.length} produk
        </span>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semua
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group block"
          >
            {/* Product Image */}
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-2">
              <Image
                src={product.productImages[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Stats Overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 justify-between">
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                  <Heart className="w-3 h-3" />
                  <span>{(product.postData.interactions.likes / 1000).toFixed(1)}k</span>
                </div>
                <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                  {product.productData.sold}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-[#ff2742] transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#ff2742]">
                  {product.currency} {product.price.toLocaleString('id-ID')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {product.currency} {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
