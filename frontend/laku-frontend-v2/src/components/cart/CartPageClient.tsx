'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { StoreWrapper } from './StoreWrapper';
import { CartHeader } from './CartHeader';
import CartTotalSticky from './CartTotalSticky';
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

  // Keep `selectAll` in sync with individual product selections:
  // - If every product across all stores is selected, `selectAll` becomes true.
  // - If any single product is unselected, `selectAll` becomes false.
  useEffect(() => {
    const hasProducts = stores.some(s => s.products.length > 0);
    const allSelected = hasProducts && stores.every(s => s.products.every(p => p.isSelected));
    setSelectAll(allSelected);
  }, [stores]);

  const handleDeleteSelected = () => {
    setStores(stores.map(store => ({
      ...store,
      products: store.products.filter(p => !p.isSelected)
    })).filter(store => store.products.length > 0));
  };

  // total number of product rows in cart (count of product entries)
  const totalItemCount = stores.reduce((acc, store) => acc + store.products.length, 0);

  return (
    <div className="min-h-screen bg-white-50">
      <CartHeader count={totalItemCount} />
      <div className="max-w-7xl mx-auto px-0 py-6 flex flex-col gap-[10px]">
        {/* Quick link to Virtual Fitting Room */}
        <div className="px-4">
          <Link
            href="/fitting-room"
            className="text-black text-base font-medium inline-flex items-center"
            aria-label="Coba Virtual Fitting Room"
          >
            <span>Coba Virtual Fitting Room</span>
            <ChevronRight className="w-4 h-4 ml-3 text-black" />
          </Link>
        </div>

        {/* Store Sections simplified to use CartStoreBio and CartProductBody */}
        {stores.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-xl text-gray-600">Keranjang Anda kosong</p>
          </div>
        ) : (
          stores.map((store) => (
            <StoreWrapper
              key={store.storeId}
              store={store}
              onSelectAll={(checked: boolean) => {
                setStores(stores.map(s =>
                  s.storeId === store.storeId
                    ? { ...s, products: s.products.map(p => ({ ...p, isSelected: checked })) }
                    : s
                ));
              }}
              onToggle={(productId: string) => {
                setStores(stores.map(s =>
                  s.storeId === store.storeId
                    ? { ...s, products: s.products.map(p => p.id === productId ? { ...p, isSelected: !p.isSelected } : p) }
                    : s
                ));
              }}
              onDelete={(productId: string) => {
                setStores(stores
                  .map(s =>
                    s.storeId === store.storeId
                      ? { ...s, products: s.products.filter(p => p.id !== productId) }
                      : s
                  )
                  .filter(s => s.products.length > 0)
                );
              }}
              onQuantityChange={(productId: string, quantity: number) => {
                setStores(stores.map(s =>
                  s.storeId === store.storeId
                    ? { ...s, products: s.products.map(p => p.id === productId ? { ...p, quantity } : p) }
                    : s
                ));
              }}
            />
          ))
        )}

      </div>
      <CartTotalSticky selectAll={selectAll} onSelectAll={handleSelectAll} summary={summary} />
    </div>
  );
}