'use client';

import React from 'react';
import { CartItem } from '@/types';
import QuantityStepper from './QuantityStepper';
import { useCartStore } from '@/stores/cart-store';
import { useLanguage } from '@/contexts/LanguageContext';

interface CartItemRowProps {
  item: CartItem;
  selected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function CartItemRow({ item, selected, onToggleSelect }: CartItemRowProps) {
  const { t } = useLanguage();
  const removeItem = useCartStore(state => state.removeItem);

  return (
    <div className="flex items-start p-3 border-b last:border-b-0">
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(item.id)}
          className="mt-1 mr-3 accent-[#dc2626] w-4 h-4"
        />
      </div>

      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-sm mr-3"
        style={{ width: 80, height: 80 }}
      />

      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900 truncate">{item.name}</div>
        <div className="mt-1">
          {/* Variant pill: small light-gray rounded box showing selected variant */}
          <div className="text-xs text-gray-600 bg-gray-100 inline-block px-2 py-0.5 rounded-md">
            {(item as any).variant ? (item as any).variant : t('product.specifications')}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-base font-bold text-[#dc2626]">Rp {(item.price || 0).toLocaleString('id-ID')}</div>
          {item.originalPrice ? (
            <div className="text-xs line-through text-gray-400 ml-2">Rp {item.originalPrice.toLocaleString('id-ID')}</div>
          ) : null}
        </div>
      </div>

      <div className="ml-4 flex flex-col items-end justify-between">
        <QuantityStepper productId={item.id} initialQuantity={item.quantity} className="text-sm" />
        <button
          onClick={() => removeItem(item.id)}
          className="text-xs text-gray-500 mt-2"
        >
          {t('cart.delete')}
        </button>
      </div>
    </div>
  );
}

