'use client';

import { Tag } from 'lucide-react';

export function PlatformVoucher() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tag className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-900">Voucher Platform</span>
          <span className="text-xs text-gray-600">Tidak ada item dipilih</span>
        </div>

        <button className="text-sm text-red-500 font-medium hover:underline">
          Pilih atau masukkan kode
        </button>
      </div>
    </div>
  );
}