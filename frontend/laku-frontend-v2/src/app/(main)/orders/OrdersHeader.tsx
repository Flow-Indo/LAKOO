 'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, MessageCircle } from 'lucide-react';
import React from 'react';

export default function OrdersHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          aria-label="Back"
          onClick={() => router.push('/profile')}
          className="p-2 -ml-2"
        >
          <ChevronLeft className="w-6 h-6 text-red-600" />
        </button>

        <h1 className="text-xl font-semi-bold text-gray-900">Pesanan Saya</h1>
      </div>

      <div className="flex items-center gap-4">
        <button aria-label="Search" className="p-2" onClick={() => router.push('/search')}>
          <Search className="w-6 h-6 text-gray-700" />
        </button>
        <button aria-label="Messages" className="p-2" onClick={() => router.push('/messages')}>
          <MessageCircle className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}

