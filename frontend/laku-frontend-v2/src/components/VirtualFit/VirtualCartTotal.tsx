'use client';

import React from 'react';
import CartSelectButton from '../cart/CartSelectButton';

interface Summary {
  selectedCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

interface Props {
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  summary: Summary;
  onCheckout?: () => void;
}

export default function VirtualCartTotal({ selectAll, onSelectAll, summary, onCheckout }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

  return (
    // sticky footer across sizes (positioned above BottomNav) - match CartTotalSticky markup
    <div className="fixed bottom-16 left-0 right-0 z-[9999] md:hidden">
      <div className="bg-white rounded-t-lg p-3 flex items-center justify-between w-full border-b border-gray-200">
        <div className="flex items-center gap-[10px]">
          <label
            className="inline-flex items-center cursor-pointer select-none gap-[10px]"
            onClick={() => onSelectAll(!selectAll)}
          >
            <CartSelectButton
              selected={selectAll}
              onClick={() => onSelectAll(!selectAll)}
              ariaLabel="Select all products"
              sizeClass="w-4 h-4 sm:w-6 sm:h-6"
            />
            <span className="text-sm text-gray-700">Semua</span>
          </label>
        </div>

        <div className="flex-1 flex items-center justify-center gap-2">
          <div className="text-lg font-semibold text-red-600">{formatCurrency(summary.total)}</div>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={() => onCheckout && onCheckout()}
            className="text-white text-sm rounded-md pl-4 pr-[1px] py-2 font-medium"
            style={{
              background: 'linear-gradient(135deg, #C9A961 0%, #E8D399 100%)',
            }}
          >
            Checkout（{summary.selectedCount}）
          </button>
        </div>
      </div>
    </div>
  );
}

