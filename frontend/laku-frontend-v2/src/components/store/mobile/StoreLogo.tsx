'use client';

import { Store } from '@/types/store';
import { SafeImage } from '@/components/shared/SafeImage';


export function StoreLogo({ store, className = '' }: { store: Store; className?: string }) {
  return (
    <div className={`relative -mt-8 flex-shrink-0 ${className}`}>
      <div className="w-16 h-16 rounded-full overflow-hidden">
        <SafeImage
          src={store.logo}
          alt={store.name}
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}
