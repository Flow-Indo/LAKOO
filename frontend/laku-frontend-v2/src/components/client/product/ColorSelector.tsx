'use client';

import { useState, useEffect } from 'react';

interface Color {
  id: string;
  name: string;
  image?: string;
  isHot?: boolean;
}

interface Props {
  colors: Color[];
  initial?: string | null;
  onChange?: (colorId: string) => void;
}

export default function ColorSelector({ colors, initial = null, onChange }: Props) {
  const [selected, setSelected] = useState<string | null>(initial);

  useEffect(() => {
    if (!selected && colors.length > 0) {
      setSelected(colors[0].id);
    }
  }, [colors, selected]);

  function handleSelect(id: string) {
    setSelected(id);
    onChange?.(id);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((c) => (
        <button
          key={c.id}
          onClick={() => handleSelect(c.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
            selected === c.id ? 'border-red-500 bg-red-50' : 'border-gray-200'
          }`}
          aria-pressed={selected === c.id}
        >
          {c.image ? <img src={c.image} alt={c.name} className="w-6 h-6 rounded object-cover" /> : <div className="w-6 h-6 bg-gray-100 rounded" />}
          <span className="text-sm text-gray-900">{c.name}</span>
        </button>
      ))}
    </div>
  );
}
