'use client';

import { Tag } from 'lucide-react';
import type { StoreVoucher } from '@/types/cart';

interface Props {
  vouchers: StoreVoucher[];
}

export function VoucherSection({ vouchers }: Props) {
  if (vouchers.length === 0) return null;

  return (
    <div className="p-4 bg-white-50 border-t border-gray-200">
      
      <div className="flex items-center gap-3">
        <Tag className="w-5 h-5 text-red-500" />

        <div className="flex-1">
          <p className="text-sm font-medium text-red-500 mb-1">
            {vouchers[0].title}
          </p>
          <p className="text-xs text-gray-600">{vouchers[0].description}</p>
        </div>

        <button className="text-sm text-red-500 font-medium hover:underline">
          Voucher Lainnya
        </button>
      </div>
    </div>
  );
}