'use client';

import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import ColorOption from '../ui/ColorOption';
import { ColorVariant } from '@/types/checkout';

interface ColorSelectorProps {
  colors: ColorVariant[];
  selectedColor: string | null;
  onSelect: (colorId: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onSelect,
}: ColorSelectorProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header with View Toggle - Xiaohongshu Style */}
      <div className="pb-2 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-gray-900">
          {colors.length > 1 ? `Warna (${colors.length})` : 'Foto (1)'}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-gray-900' : 'text-gray-500'}`} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            aria-label="List view"
          >
            <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-gray-900' : 'text-gray-500'}`} />
          </button>
        </div>
      </div>

      {/* Color Grid/List - Xiaohongshu Style */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-3' : 'flex flex-col gap-2.5'}>
        {colors.map((color) => (
          <ColorOption
            key={color.id}
            color={color}
            isSelected={selectedColor === color.id}
            onSelect={() => onSelect(color.id)}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
