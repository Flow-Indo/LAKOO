'use client';

import { useState, useEffect } from 'react';

interface Props {
  initial?: number;
  min?: number;
  max?: number;
  onChange?: (qty: number) => void;
}

export default function QuantitySelector({ initial = 1, min = 1, max = 999, onChange }: Props) {
  const [qty, setQty] = useState<number>(Math.max(min, initial));

  useEffect(() => {
    onChange?.(qty);
  }, [qty, onChange]);

  function dec() {
    setQty((p) => Math.max(min, p - 1));
  }
  function inc() {
    setQty((p) => Math.min(max, p + 1));
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={dec} className="px-3 py-2 border rounded-l-md bg-white">-</button>
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
        className="w-16 text-center border-t border-b py-2"
      />
      <button onClick={inc} className="px-3 py-2 border rounded-r-md bg-white">+</button>
    </div>
  );
}
