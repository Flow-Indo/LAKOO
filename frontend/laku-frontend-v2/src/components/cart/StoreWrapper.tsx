 'use client';

import { CartStoreBio } from './CartStoreBio';
import { CartProductBody } from './CartProductBody';
import { VoucherSection } from './VoucherSection';
import type { StoreCart } from '@/types/cart';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  store: StoreCart;
  onSelectAll: (checked: boolean) => void;
  onToggle: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export function StoreWrapper({ store, onSelectAll, onToggle, onDelete }: Props) {
  return (
    <div className="rounded-lg overflow-visible bg-white">
      <div className="space-y-[10px]">
        <CartStoreBio
          store={store}
          allSelected={store.products.every(p => p.isSelected)}
          onSelectAll={onSelectAll}
        />

        <div>
          {store.products.map((product) => (
            <CartProductBody
              key={product.id}
              product={product}
              store={store}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>

        <VoucherSection vouchers={store.vouchers} />
      </div>
    </div>
  );
}

