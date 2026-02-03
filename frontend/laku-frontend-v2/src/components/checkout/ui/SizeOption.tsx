'use client';

import { SizeVariant } from '@/types/checkout';

interface SizeOptionProps {
  size: SizeVariant;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SizeOption({
  size,
  isSelected,
  onSelect,
}: SizeOptionProps) {
  const isOutOfStock = size.stock === 0;

  return (
    <button
      onClick={onSelect}
      disabled={isOutOfStock}
      className={`px-3 py-2.5 rounded-lg border-1 transition-all gap-4 ${
        isSelected
          ? 'border-[#FF2442] bg-[#FFF0F3] text-[#FF2442] font-medium'
          : isOutOfStock
          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
          : 'border-gray-200 hover:border-gray-300 text-gray-900'
      }`}
    >
      <span className="text-sm font-medium">{size.name}</span>
      {size.weightRecommendation && (
        <div className="text-[12px] text-gray-500">
          {size.weightRecommendation}
        </div>
      )}
      {isOutOfStock && (
        <div className="text-[10px] text-gray-400 mt-0.5">Habis</div>
      )}
    </button>
  );
}
