 'use client';

import React from 'react';
import CartSelectButton from './CartSelectButton';

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

export default function CartTotalSticky({ selectAll, onSelectAll, summary, onCheckout }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

  return (
    // show on mobile above BottomNav which is fixed at bottom
    <div className="fixed bottom-[72px] left-0 right-0 z-50 md:hidden">
      {/* full-bleed sticky bar — no max-width wrapper so bg fills full width */}
      <div className="bg-white border border-gray-100 rounded-t-lg shadow-sm p-3 flex items-center justify-between w-full">
          <div className="flex items-center gap-[10px]">
            <label className="inline-flex items-center cursor-pointer select-none gap-[10px]">
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
              className="bg-gradient-to-r from-[#d8a93b] to-[#d7a93b] text-white rounded-md pl-4 pr-[1px] py-2 font-medium"
            >
              Checkout（{summary.selectedCount}）
            </button>
        </div>
      </div>
    </div>
  );
}

