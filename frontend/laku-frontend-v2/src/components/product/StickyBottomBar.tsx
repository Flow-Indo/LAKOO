'use client';

import { useState } from 'react';
import { Store, MessageCircle, Star } from 'lucide-react';
import Link from 'next/link';

interface StickyBottomBarProps {
  product: {
    id: string;
    name: string;
    price: number;
    sellerId: string;
    sellerName: string;
  };
  wishlistCount?: number;
}

export default function StickyBottomBar({ product, wishlistCount = 432 }: StickyBottomBarProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    // Add wishlist logic here
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Store Icon Button */}
        <Link href="http://localhost:3001/store/store-001" className="flex flex-col items-center justify-center min-w-[48px]">
          <Store className="w-5 h-5 text-gray-700" />
          <span className="text-[10px] text-gray-600 mt-0.5">Toko</span>
        </Link>

        {/* Customer Support Icon Button */}
        <Link href="http://localhost:3001/messages" className="flex flex-col items-center justify-center min-w-[48px]">
          <MessageCircle className="w-5 h-5 text-gray-700" />
          <span className="text-[10px] text-gray-600 mt-0.5">Bantuan</span>
        </Link>

        {/* Like Button - Star with border */}
        <button
          onClick={handleLikeToggle}
          className="flex flex-col items-center justify-center min-w-[48px]"
        >
          <Star className={`w-5 h-5 ${isLiked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
          <span className="text-[10px] text-gray-600 mt-0.5">{wishlistCount}</span>
        </button>

        {/* Add to Cart Button */}
        <button className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold text-center text-sm">
          Keranjang
        </button>

        {/* Buy Now Button */}
        <button className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold text-center text-sm ml-2">
          Beli
        </button>
      </div>
    </div>
  );
}