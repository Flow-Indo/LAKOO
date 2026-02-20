 'use client';

import React, { useState } from 'react';

type Asset = { src: string; alt?: string };

interface Props {
  shirts: Asset[];
  pants: Asset[];
}

export default function CartVirtualFit({ shirts, pants }: Props) {
  const [active, setActive] = useState<'tops' | 'bottoms' | null>(null);

  const items = active === 'tops' ? shirts : active === 'bottoms' ? pants : [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActive(active === 'tops' ? null : 'tops')}
          className={`px-4 py-2 rounded-md font-medium ${active === 'tops' ? 'bg-gray-100' : 'bg-white border'}`}
        >
          Tops
        </button>
        <button
          onClick={() => setActive(active === 'bottoms' ? null : 'bottoms')}
          className={`px-4 py-2 rounded-md font-medium ${active === 'bottoms' ? 'bg-gray-100' : 'bg-white border'}`}
        >
          Bottoms
        </button>
      </div>

      {/* Dropdown / option panel */}
      {active && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {items.map((it, idx) => (
            <div key={idx} className="cursor-pointer p-2 bg-white rounded shadow-sm flex items-center justify-center">
              <img src={it.src} alt={it.alt ?? `${active}-${idx}`} className="max-h-28 object-contain" />
            </div>
          ))}
        </div>
      )}

      {/* Large preview area (placeholder) */}
      <div className="bg-white rounded-lg shadow-sm h-[520px] flex items-center justify-center">
        <p className="text-gray-400">Virtual fit preview</p>
      </div>
    </main>
  );
}

