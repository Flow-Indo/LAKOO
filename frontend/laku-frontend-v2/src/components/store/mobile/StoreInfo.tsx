 'use client';

import { Store } from '@/types/store';

export function StoreInfo({ store }: { store: Store }) {
  return (
    <div className="flex items-start gap-4 mb-1">
      <h1 style={{ fontWeight: 600 }} className="text-l font-bold text-white">{store.name}</h1>
    </div>
  );
}

