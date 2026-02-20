'use client';

import { useState, useEffect } from 'react';

interface Props {
  sizes: string[];
  availableSizes?: string[];
  initial?: string | null;
  onChange?: (size: string) => void;
}

export default function SizeSelector({ sizes, availableSizes = [], initial = null, onChange }: Props) {
  const [selected, setSelected] = useState<string | null>(initial);

  useEffect(() => {
    if (!selected && sizes.length > 0) {
      setSelected(sizes[0]);
    }
  }, [sizes, selected]);

  function handleSelect(size: string) {
    if (availableSizes.length > 0 && !availableSizes.includes(size)) return;
    setSelected(size);
    onChange?.(size);
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {sizes.map((s) => {
        const disabled = availableSizes.length > 0 && !availableSizes.includes(s);
        return (
          <button
            key={s}
            onClick={() => handleSelect(s)}
            disabled={disabled}
            className={`py-2 rounded-lg text-sm font-medium border transition ${
              selected === s ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 text-gray-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
