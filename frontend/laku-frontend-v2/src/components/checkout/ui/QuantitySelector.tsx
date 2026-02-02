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
        className="h-8 w-8 rounded-full border-gray-300"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="min-w-[40px] text-center">
        <span className="text-sm font-medium">{value}</span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={value >= max}
        className="h-8 w-8 rounded-full border-gray-300"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
