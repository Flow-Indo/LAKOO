'use client';

import Image from 'next/image';
import { ChevronRight, Store } from 'lucide-react';
import type { StoreCart } from '@/types/cart';
import CartSelectButton from './CartSelectButton';

interface Props {
  store: StoreCart;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
}

export function CartStoreBio({ store, allSelected, onSelectAll }: Props) {
  return (
    <div className="px-4 pt-[10px] pb-[10px] flex items-center gap-3">
      <CartSelectButton
        selected={allSelected}
        onClick={() => onSelectAll(!allSelected)}
        sizeClass="w-4 h-4 sm:w-6 sm:h-6"
        ariaLabel="Select all products in store"
      />
      <Store className="w-4 h-4 text-gray-500" />

      <span
        className="text-sm font-bold text-gray-900"
        style={{ fontWeight: 600 }}
      >
        {store.storeName}
      </span>

      <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
    </div>
  );
}

