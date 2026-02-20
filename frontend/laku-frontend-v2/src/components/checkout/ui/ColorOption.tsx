'use client';

import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
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
        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-[#FF2442]'
            : 'border-gray-200 hover:border-gray-300'
        } ${color.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={color.image}
            alt={color.label || color.name}
            fill
            className="object-cover"
            unoptimized
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
      </button>
    );
  }

  // Grid View - EXACT Xiaohongshu Style
  return (
    <div className="relative">
      <button
        onClick={onSelect}
        disabled={color.stock === 0}
        className={`relative w-full block ${color.stock === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {/* OUTER FRAME - Contains both image and color name */}
        <div
          className={`w-full rounded-2xl overflow-hidden transition-all ${
            isSelected
              ? 'border-[1px] border-[#FF2442] bg-[#FFF0F3]'
              : 'border-1 border-gray-200'
          } ${color.stock === 0 ? 'opacity-40' : ''}`}
        >
          {/* Image Container with Padding - Creates space around image */}
          <div className="p-2">
            {/* Rounded Image */}
            <div
              className="relative w-full rounded-xl overflow-hidden"
              style={{ aspectRatio: '3/4' }}
            >
              <Image
                src={color.image}
                alt={color.label || color.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 200px"
                priority={isSelected}
                unoptimized
              />

              {/* Small Zoom Icon - Bottom Right */}
              <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-md p-1 shadow-sm">
                <Maximize2 className="h-3 w-3 text-gray-600" />
              </div>

              {/* Out of Stock Overlay */}
              {color.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                  <span className="text-sm text-white font-medium px-3 py-1 bg-gray-900/80 rounded-full">
                    Habis
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Color Name INSIDE Frame - Below Image with separator */}
          <div className="px-3 pb-3 pt-1">
            <p className={`text-center text-[13px] leading-tight font-medium ${
              isSelected ? 'text-[#FF2442]' : 'text-gray-700'
            }`}>
              {color.label || color.name}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
