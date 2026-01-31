'use client';

import { Tag } from 'lucide-react';
import type { StoreVoucher } from '@/types/cart';
import { ChevronRight } from 'lucide-react';
interface Props {
  vouchers: StoreVoucher[];
}

export function VoucherSection({ vouchers }: Props) {
  if (vouchers.length === 0) return null;

  return (
    <div className="py-2 px-4 bg-white-50 border-t border-gray-200">
      
      <div className="flex items-center gap-3">
        <Tag className="w-5 h-5 text-red-600" />

        <div className="flex-1">
          <p className="text-sm font-medium text-red-600">
            {vouchers[0].title}
          </p>
          <p className="text-xs text-gray-600 w-[200px]">{vouchers[0].description}</p>
        </div>

        <button className="text-sm text-gray-900 font-light hover:underline">
        <ChevronRight/>
        </button>
      </div>
    </div>
  );
}