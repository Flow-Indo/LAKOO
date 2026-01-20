'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ProductSeller } from '@/types/product';

interface Props {
  name: string;
  shortDescription: string;
  tags: string[];
  seller: ProductSeller;
}

export function ProductTitle({ name, shortDescription, tags, seller }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white px-4 py-6">
      {/* Badges Row */}
      <div className="flex items-center gap-2 mb-3">
        {seller.isTrending && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-semibold">
            Trends
          </span>
        )}
        <span className="bg-black text-white text-xs px-2 py-0.5 rounded font-semibold">
          Choice
        </span>
        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
          Seller
        </span>
      </div>

      {/* Product Name */}
      <h1 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-3">
        {name}
      </h1>

      {/* Quick Info Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Seller Badge Row */}
      <div className="flex items-center gap-2 mb-4">
        <img
          src={seller.logo}
          alt={seller.name}
          className="w-5 h-5 rounded-full"
        />
        <span className="text-sm font-medium text-gray-700">{seller.name}</span>
        {seller.isVerified && (
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="border-t pt-4">
        <div className="flex items-start justify-between">
          <p className={`text-gray-600 text-sm leading-relaxed ${
            !isExpanded ? 'line-clamp-2' : ''
          }`}>
            {shortDescription}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}