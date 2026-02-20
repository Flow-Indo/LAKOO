'use client';

import { Minus, Plus } from 'lucide-react';

interface Props {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disableDecrease?: boolean;
  disableIncrease?: boolean;
}

export function CartPlusMinus({
  quantity,
  onDecrease,
  onIncrease,
  disableDecrease = false,
  disableIncrease = false,
}: Props) {
  return (
    <div className="flex items-center gap-2 flex-nowrap overflow-visible">
      <button
        onClick={onDecrease}
        disabled={disableDecrease}
        className="w-10 h-10 sm:w-8 sm:h-8 md:w-8 md:h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4 text-gray-600" />
      </button>

      <input
        type="text"
        value={quantity}
        readOnly
        className="w-14 sm:w-12 md:w-16 h-8 text-center border border-gray-200 rounded text-sm flex-shrink-0"
        aria-label="Quantity"
      />

      <button
        onClick={onIncrease}
        disabled={disableIncrease}
        className="w-10 h-10 sm:w-8 sm:h-8 md:w-8 md:h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}

