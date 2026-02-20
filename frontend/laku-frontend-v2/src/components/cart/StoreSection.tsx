'use client';

import Image from 'next/image';
import { Store, ChevronRight } from 'lucide-react';
import { CartItem } from './CartItem';
import { VoucherSection } from './VoucherSection';
import type { StoreCart } from '@/types/cart';

interface Props {
  store: StoreCart;
  onUpdate: (store: StoreCart) => void;
}

export function StoreSection({ store, onUpdate }: Props) {
  const allSelected = store.products.every(p => p.isSelected);

  const handleSelectAll = (checked: boolean) => {
    onUpdate({
      ...store,
      products: store.products.map(p => ({ ...p, isSelected: checked }))
    });
  };

  return (
    <div className="rounded-lg shadow-sm overflow-visible">

      {/* Store Header */}
      <div className="px-4 pt-[5px] pb-[5px] flex items-center gap-3">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4 accent-red-500"
        />

        <Image
          src={store.storeAvatar}
          alt={store.storeName}
          width={24}
          height={24}
          className="rounded-full"
        />

        <span className="font-medium text-gray-900">{store.storeName}</span>

        {/* free gift badge removed */}

        <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
      </div>

      {/* Products */}
      <div>
        {store.products.map((product) => (
          <CartItem
            key={product.id}
            product={product}
            onUpdate={(updatedProduct) => {
              onUpdate({
                ...store,
                products: store.products.map(p =>
                  p.id === updatedProduct.id ? updatedProduct : p
                )
              });
            }}
            onDelete={() => {
              onUpdate({
                ...store,
                products: store.products.filter(p => p.id !== product.id)
              });
            }}
          />
        ))}
      </div>

      {/* Voucher Section */}
      <VoucherSection vouchers={store.vouchers} />

      {/* Shipping Info */}
      <div className="px-4 pt-[5px] pb-[5px] bg-white-50 flex items-center gap-2 text-sm">
        <Store className="w-4 h-4 text-blue-500" />
        <span className="text-gray-600">{store.shippingInfo}</span>
        <button className="ml-auto text-red-500 font-medium hover:underline">Pelajari lebih lanjut</button>
      </div>

    </div>
  );
}