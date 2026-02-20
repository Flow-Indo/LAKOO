'use client';

import React from 'react';
import { StoreSection as SectionType, calculateStoreSavings } from '@/lib/cart-utils';
import CartItemRow from './CartItemRow';
import { useCartStore } from '@/stores/cart-store';
import { useLanguage } from '@/contexts/LanguageContext';

interface StoreSectionProps {
  section: SectionType;
}

export default function StoreSection({ section }: StoreSectionProps) {
  const { t } = useLanguage();
  const selectedIds = useCartStore(state => state.selectedIds);
  const toggleSelectItem = useCartStore(state => state.toggleSelectItem);
  const toggleSelectStore = useCartStore(state => state.toggleSelectStore);

  const itemsSelectedCount = section.items.filter(i => selectedIds.includes(i.id)).length;
  const allSelected = itemsSelectedCount === section.items.length && section.items.length > 0;

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl mb-3">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => toggleSelectStore(section.storeId)}
            className="mr-3 accent-[#dc2626] w-4 h-4"
          />
          <div className="text-sm font-bold text-gray-900">{section.storeName}</div>
          {section.voucherAvailable ? (
            <div className="ml-3 text-xs px-2 py-0.5 rounded-md bg-gradient-to-r from-yellow-300 to-orange-300 text-white">
              {t('cart.view_all')} {/* placeholder badge text */}
            </div>
          ) : null}
        </div>
        <div className="text-xs text-gray-500">{t('cart.view_all')} &gt;</div>
      </div>

      {/* promotional banner */}
      {section.voucherAvailable ? (
        <div className="px-4 py-3">
          <div className="w-full rounded-md p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100">
            <div className="text-sm text-orange-600 font-semibold">
              {t('cart.total')}: Rp {calculateStoreSavings(section).toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-0">
        {section.items.map(item => (
          <CartItemRow
            key={`${section.storeId}-${item.id}`}
            item={item}
            selected={selectedIds.includes(item.id)}
            onToggleSelect={(id) => toggleSelectItem(id)}
          />
        ))}
      </div>
    </div>
  );
}

