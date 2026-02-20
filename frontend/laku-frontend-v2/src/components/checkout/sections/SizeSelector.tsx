'use client';

import { ChevronRight } from 'lucide-react';
import SizeOption from '../ui/SizeOption';
import { SizeVariant } from '@/types/checkout';

interface SizeSelectorProps {
  sizes: SizeVariant[];
  selectedSize: string | null;
  onSelectSize: (sizeId: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
}: SizeSelectorProps) {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="py-4">
      {/* Header with Size Guide */}
      <div className="py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-gray-900">Ukuran</h3>
          <span className="text-[13px] text-gray-500">
            Rekomendasi: <span className="text-[#FF2442] font-medium">M</span>
          </span>
        </div>
        <button className="flex items-center gap-1 text-[13px] text-gray-600">
          <span>Tambah ukuran</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Size Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {sizes.map((size) => (
          <SizeOption
            key={size.id}
            size={size}
            isSelected={selectedSize === size.id}
            onSelect={() => onSelectSize(size.id)}
          />
        ))}
      </div>
    </div>
  );
}
