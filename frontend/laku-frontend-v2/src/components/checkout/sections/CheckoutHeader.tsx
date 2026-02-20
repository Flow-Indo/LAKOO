'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutHeaderProps {
  onClose: () => void;
}

export default function CheckoutHeader({ onClose }: CheckoutHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100">
      <h1 className="text-[17px] font-semibold text-gray-900">Checkout</h1>
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
