'use client';

import React from 'react';
import { useCartStore } from '@/stores/cart-store';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomSummaryBarProps {
  manageMode?: boolean;
}

export default function BottomSummaryBar({ manageMode = false }: BottomSummaryBarProps) {
  const selectedCount = useCartStore(state => state.getSelectedCount());
  const selectedTotal = useCartStore(state => state.getSelectedTotalPrice());
  const { t } = useLanguage();
  const selectAll = useCartStore(state => state.selectAll);
  const clearSelection = useCartStore(state => state.clearSelection);
  const removeItems = useCartStore(state => (state as any).removeItems);

  const allCount = useCartStore.getState().items.length;

  const handlePrimary = () => {
    if (manageMode) {
      const ids = useCartStore.getState().selectedIds;
      if (ids.length === 0) return;
      removeItems(ids);
      clearSelection();
      return;
    }
    // checkout navigation handled via Link; no-op here
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-30 bg-white border-t-2 border-gray-200 shadow-2xl md:bottom-0">
      <div className="mx-auto flex items-center justify-between w-full md:w-[600px] p-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="mr-3 accent-[#dc2626] w-4 h-4"
            onChange={(e) => {
              if (e.target.checked) selectAll();
              else clearSelection();
            }}
            checked={selectedCount > 0 && selectedCount === allCount && allCount > 0}
          />
          <div className="text-sm">{t('cart.select_all')} <span className="font-semibold">{selectedCount}</span> {t('cart.items')}</div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="text-sm text-gray-500 hidden md:block">{t('cart.total')}</div>
          <div className="text-xl font-bold text-[#dc2626]">Rp {selectedTotal.toLocaleString('id-ID')}</div>
          {manageMode ? (
            <button
              onClick={handlePrimary}
              className="ml-3 px-8 py-3 rounded-full text-white text-base font-bold shadow-lg"
              style={{ background: 'linear-gradient(90deg,#dc2626,#ff7a00)' }}
            >
              {t('cart.delete')}
            </button>
          ) : (
            <Link href="/checkout" className="ml-3">
              <button className="px-8 py-3 rounded-full text-white text-base font-bold shadow-lg" style={{ background: 'linear-gradient(90deg,#dc2626,#ff7a00)' }}>
                {t('cart.checkout')}
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

