'use client';

import Image from 'next/image';
import { Store } from '@/types/store';


export function StoreLogo({ store, className = '' }: { store: Store; className?: string }) {
  return (
    <div className={`relative -mt-8 flex-shrink-0 ${className}`}>
      <div className="w-16 h-16 rounded-full overflow-hidden">
        <Image
          src={store.logo}
          alt={store.name}
          width={60}
          height={60}
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}
