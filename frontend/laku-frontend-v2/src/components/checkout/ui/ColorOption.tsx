'use client';

import { Check, ZoomIn } from 'lucide-react';
import { ColorVariant } from '@/types/checkout';

interface ColorOptionProps {
  color: ColorVariant;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: 'grid' | 'list';
}

export default function ColorOption({
  color,
  isSelected,
  onSelect,
  viewMode,
}: ColorOptionProps) {
  if (viewMode === 'list') {
    return (
      <button
        onClick={onSelect}
        disabled={color.stock === 0}
        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
          isSelected
            ? 'border-[#FF2442] bg-[#FFF0F3]'
            : 'border-gray-200 hover:border-gray-300'
        } ${color.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <div className="relative w-20 h-24 flex-shrink-0 rounded overflow-hidden bg-white">
          <img
            src={color.image}
            alt={color.label || color.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-gray-900">{color.label || color.name}</p>
          {color.stock > 0 ? (
            <p className="text-xs text-gray-500">Stok: {color.stock}</p>
          ) : (
            <p className="text-xs text-red-500">Habis</p>
          )}
        </div>
        {isSelected && (
          <Check className="h-5 w-5 text-[#FF2442]" />
        )}
      </button>
    );
  }

  // Grid View - EXACT Xiaohongshu Style
  return (
    <div className="relative">
      <button
        onClick={onSelect}
        disabled={color.stock === 0}
        className={`relative w-full group ${color.stock === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {/* Product Image Card - 3:4 Aspect Ratio Portrait */}
        <div
          className={`relative w-full rounded-xl overflow-hidden border-2 transition-all bg-white ${
            isSelected
              ? 'border-[#FF2442] ring-2 ring-[#FFE5EA]'
              : 'border-gray-200 hover:border-gray-300'
          } ${color.stock === 0 ? 'opacity-40' : ''}`}
          style={{ aspectRatio: '3/4' }}
        >
          {/* Full Product Image - Using regular img for testing */}
          <img
            src={color.image}
            alt={color.label || color.name}
            className="w-full h-full object-cover"
            style={{ minHeight: '100%', minWidth: '100%' }}
          />

          {/* Hover Overlay with Zoom Icon */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all flex items-center justify-center">
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 rounded-full p-1.5 shadow-lg">
                <ZoomIn className="h-3.5 w-3.5 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Selection Check Mark - Top Right Corner */}
          {isSelected && (
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-[#FF2442] rounded-full p-1 shadow-md">
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </div>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {color.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
              <span className="text-sm text-white font-medium px-3 py-1 bg-gray-900 rounded-full">
                Habis
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Color Name Below Image - Centered Xiaohongshu Style */}
      <div className="mt-2.5 text-center px-1">
        <p className={`text-[13px] leading-tight ${
          isSelected ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
        }`}>
          {color.label || color.name}
        </p>
      </div>
    </div>
  );
}
