'use client';

import { useState } from 'react';
import { CartHeader } from './CartHeader';
import { StoreSection } from './StoreSection';
import { PlatformVoucher } from './PlatformVoucher';
import { CartSummary } from './CartSummary';
import { RecommendedProducts } from './RecommendedProducts';
import type { StoreCart, CartSummary as CartSummaryType } from '@/types/cart';

interface Props {
  initialCart: StoreCart[];
}

export function CartPageClient({ initialCart }: Props) {
  const [stores, setStores] = useState<StoreCart[]>(initialCart);
  const [selectAll, setSelectAll] = useState(false);

  // Calculate summary
  const summary: CartSummaryType = {
    selectedCount: stores.reduce((acc, store) =>
      acc + store.products.filter(p => p.isSelected).length, 0
    ),
    subtotal: stores.reduce((acc, store) =>
      acc + store.products
        .filter(p => p.isSelected)
        .reduce((sum, p) => sum + (p.price * p.quantity), 0), 0
    ),
    shipping: 0,
    discount: 0,
    total: 0,
  };

  summary.total = summary.subtotal + summary.shipping - summary.discount;

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setStores(stores.map(store => ({
      ...store,
      products: store.products.map(p => ({ ...p, isSelected: checked }))
    })));
  };

  const handleDeleteSelected = () => {
    setStores(stores.map(store => ({
      ...store,
      products: store.products.filter(p => !p.isSelected)
    })).filter(store => store.products.length > 0));
  };

  return (
    <div className="min-h-screen bg-white-50">
      <CartHeader />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">

        {/* Store Sections */}
        {stores.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-xl text-gray-600">Keranjang Anda kosong</p>
          </div>
        ) : (
          stores.map((store) => (
            <StoreSection
              key={store.storeId}
              store={store}
              onUpdate={(updatedStore) => {
                setStores(stores.map(s =>
                  s.storeId === updatedStore.storeId ? updatedStore : s
                ));
              }}
            />
          ))
        )}

        {/* Platform Voucher */}
        {stores.length > 0 && <PlatformVoucher />}

        {/* Recommended Products */}
        <RecommendedProducts />

      </div>

      {/* Bottom Summary Bar - Sticky */}
      {stores.length > 0 && (
        <CartSummary
          summary={summary}
          selectAll={selectAll}
          onSelectAll={handleSelectAll}
          onDelete={handleDeleteSelected}
        />
      )}
    </div>
  );
}