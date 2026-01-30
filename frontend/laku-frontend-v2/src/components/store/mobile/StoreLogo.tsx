 'use client';

import Image from 'next/image';
import { Store } from '@/types/store';
import { Shield } from 'lucide-react';

export function StoreLogo({ store, className = '' }: { store: Store; className?: string }) {
  return (
    <div className={`relative -mt-8 flex-shrink-0 ${className}`}>
      <div className="w-12 h-12 rounded-xl overflow-hidden border-4 border-white bg-white shadow-lg">
        <Image
          src={store.logo}
          alt={store.name}
          width={15}
          height={15}
          className="w-full h-full object-cover"
        />
      </div>
      {store.verified && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Shield className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
}

