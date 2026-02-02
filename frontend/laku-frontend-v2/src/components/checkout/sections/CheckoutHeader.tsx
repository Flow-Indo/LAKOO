'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutHeaderProps {
  onClose: () => void;
}

export default function CheckoutHeader({ onClose }: CheckoutHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-[11px] text-emerald-700 font-medium">
          Garansi Platform | 7 Hari Pengembalian Gratis
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8 rounded-full hover:bg-gray-100"
      >
        <X className="h-5 w-5 text-gray-600" />
      </Button>
    </div>
  );
}
