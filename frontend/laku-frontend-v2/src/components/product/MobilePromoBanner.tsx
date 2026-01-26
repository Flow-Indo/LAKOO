'use client';

import { ChevronRight } from 'lucide-react';

export default function MobilePromoBanner({ product }: any) {
  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-2">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs sm:text-sm font-semibold">Super Deal</div>
        <div className="text-xs sm:text-sm font-normal hidden sm:block">Diskon Instan Special Offer</div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-xs sm:text-sm">
          <span className="font-bold">Rp </span>
          <span className="font-bold text-lg sm:text-2xl">{product.salePrice.toLocaleString('id-ID')}</span>
          <span className="font-bold line-through opacity-70 text-xs sm:text-sm"> {product.originalPrice.toLocaleString('id-ID')}</span>
        </div>
        <div className="text-xs sm:text-sm font-normal">Terjual {product.sold}+</div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="bg-white text-red-600 px-1.5 sm:px-2 py-1 rounded text-xs font-bold flex items-center gap-1 flex-1 min-w-0">
          <span>↓</span>
          <span className="truncate">Diskon {product.discountPercentage}% Hemat Rp {(product.originalPrice - product.salePrice).toLocaleString('id-ID')}</span>
        </div>
        <div className="bg-white text-red-600 px-1.5 sm:px-2 py-1 rounded text-xs font-bold flex-shrink-0">01:59:50</div>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-auto flex-shrink-0" />
      </div>
    </div>
  );
}

