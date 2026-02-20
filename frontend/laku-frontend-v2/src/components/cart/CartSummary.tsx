'use client';

import { useRouter } from 'next/navigation';
import type { CartSummary as CartSummaryType } from '@/types/cart';

interface Props {
  summary: CartSummaryType;
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  onDelete: () => void;
}

export function CartSummary({ summary, selectAll, onSelectAll, onDelete }: Props) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 md:left-[72px] xl:left-[245px] right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Left Side - Select All & Actions */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 accent-red-500"
              />
              <span className="text-sm text-gray-900">
                Pilih Semua ({summary.selectedCount})
              </span>
            </label>

            <button
              onClick={onDelete}
              disabled={summary.selectedCount === 0}
              className="text-sm text-gray-900 hover:text-red-500 disabled:opacity-30"
            >
              Hapus
            </button>

            <button className="text-sm text-red-500 hover:underline">
              Pindah ke Suka
            </button>
          </div>

          {/* Right Side - Summary & Checkout */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">
                Total ({summary.selectedCount} item{summary.selectedCount !== 1 ? '' : ''}):
              </p>
              <p className="text-2xl font-bold text-red-500">
                Rp{summary.total.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              disabled={summary.selectedCount === 0}
              className="px-12 py-3 bg-red-500 text-white font-medium rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Check Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}