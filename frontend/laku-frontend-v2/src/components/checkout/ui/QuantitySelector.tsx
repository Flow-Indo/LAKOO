'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={value <= min}
        className="h-7 w-7 rounded-md border-gray-300 bg-white hover:bg-gray-100"
      >
        <Minus className="h-3 w-3 text-gray-700" />
      </Button>

      <div className="min-w-[40px] text-center">
        <span className="text-sm font-bold text-gray-900">{value}</span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={value >= max}
        className="h-7 w-7 rounded-md border-gray-300 bg-white hover:bg-gray-100"
      >
        <Plus className="h-3 w-3 text-gray-700" />
      </Button>
    </div>
  );
}
