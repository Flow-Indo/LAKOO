'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

export function CartButton() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
    >
      <ShoppingCart className="w-5 h-5 text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}