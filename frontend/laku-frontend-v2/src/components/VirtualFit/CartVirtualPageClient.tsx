'use client';

import React, { useState } from 'react';

import PreviewFit from './PreviewFit';
import OptionFit from './OptionFit';
import VirtualCartTotal from '@/components/VirtualFit/VirtualCartTotal';
import { storeAssets } from '@/lib/mock-store-data';
import { useCartStore } from '@/stores/cart-store';

export default function CartVirtualPageClient() {
  const assetsAny = storeAssets['store-001'] ?? Object.values(storeAssets)[0];
  const initialShirts: any[] = (assetsAny as any).shirtsProducts ?? [];
  const initialPants: any[] = (assetsAny as any).pantsProducts ?? [];

  const [shirts, setShirts] = useState<any[]>(initialShirts);
  const [pants, setPants] = useState<any[]>(initialPants);

  const [selectedShirtId, setSelectedShirtId] = useState<string | undefined>(() => initialShirts[0]?.id);
  const [selectedPantId, setSelectedPantId] = useState<string | undefined>(() => initialPants[0]?.id);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  // use central cart store for selection
  const selectedIds = useCartStore(state => state.selectedIds);
  const toggleSelect = useCartStore(state => state.toggleSelectItem);
  const selectAllStore = useCartStore(state => state.selectAll);
  const clearSelection = useCartStore(state => state.clearSelection);
  const selectedCount = useCartStore(state => state.getSelectedCount());
  const selectedTotal = useCartStore(state => state.getSelectedTotalPrice());

  const selectedShirt = shirts.find(s => s.id === selectedShirtId);
  const selectedPant = pants.find(p => p.id === selectedPantId);

  

  // when toggling select mode, if we're turning it off (cancel), clear selectedIds
  function handleToggleSelectMode() {
    setSelectMode((prev) => {
      if (prev) {
        // turning off select mode -> clear selection in store
        clearSelection();
        return false;
      }
      return true;
    });
  }

  const allIds = [...shirts.map(s => s.id), ...pants.map(p => p.id)];
  const selectAll = selectedCount === allIds.length && allIds.length > 0;
  function onSelectAll(checked: boolean) {
    if (checked) selectAllStore();
    else clearSelection();
  }

  const subtotal = selectedIds.reduce((acc, id) => {
    const s = shirts.find(x => x.id === id);
    if (s) return acc + (s.price ?? 0);
    const p = pants.find(x => x.id === id);
    if (p) return acc + (p.price ?? 0);
    return acc;
  }, 0);

  const summary = {
    selectedCount,
    subtotal,
    shipping: 0,
    discount: 0,
    total: subtotal,
  };

  return (
    <div className="min-h-screen bg-white-50 flex flex-col">
      
      <div className="flex-1 min-h-0 overflow-auto">
        <PreviewFit
          shirts={shirts}
          pants={pants}
          selectedShirtId={selectedShirtId}
          selectedPantId={selectedPantId}
          onSelectShirt={(id) => setSelectedShirtId(id)}
          onSelectPant={(id) => setSelectedPantId(id)}
        />
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-end h-[30px]" style={{ backgroundColor: '#F7F7F7' }}>
          <button
            type="button"
            className="w-[60px] h-[30px] bg-[#636363] text-xs text-white rounded-full border"
            onClick={handleToggleSelectMode}
            aria-pressed={selectMode}
          >
            {selectMode ? 'Cancel' : 'Select'}
          </button>
        </div>
        <OptionFit
          shirts={shirts}
          pants={pants}
          selectedShirtId={selectedShirtId}
          selectedPantId={selectedPantId}
          onSelectShirt={(id) => setSelectedShirtId(id)}
          onSelectPant={(id) => setSelectedPantId(id)}
          selectMode={selectMode}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onRemoveProduct={(type, id) => {
            // ensure selection removed from store
            useCartStore.setState((s) => ({ selectedIds: s.selectedIds.filter(x => x !== id) }));
            if (type === 'shirt') {
              setShirts((prev) => {
                const next = prev.filter((x) => x.id !== id);
                setSelectedShirtId((cur) => (cur === id ? next[0]?.id : cur));
                return next;
              });
            } else {
              setPants((prev) => {
                const next = prev.filter((x) => x.id !== id);
                setSelectedPantId((cur) => (cur === id ? next[0]?.id : cur));
                return next;
              });
            }
          }}
          onPopupOpenChange={(open: boolean) => {
            // set a top-level flag in parent if needed
            setPopupOpen(open);
          }}
        />
      </div>
      <VirtualCartTotal popupOpen={popupOpen} selectAll={selectAll} onSelectAll={onSelectAll} summary={summary} onCheckout={() => { console.log('checkout'); }} />
    </div>
  );
}

