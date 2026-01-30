 'use client';

import React from 'react';

interface Props {
  selectMode: boolean;
  onToggleSelectMode: () => void;
}

export default function CartVirtualHeader({ selectMode, onToggleSelectMode }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between h-[56px]">
        <h1 className="text-2xl font-bold text-black">Outfit Of The Day</h1>
        <button
          type="button"
          className="px-4 py-2 bg-[#636363] text-sm text-white rounded-full border "
          onClick={onToggleSelectMode}
          aria-pressed={selectMode}
        >
          {selectMode ? 'Cancel' : 'Select'}
        </button>
      </div>
    </header>
  );
}

