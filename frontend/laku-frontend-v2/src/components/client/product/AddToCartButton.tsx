'use client';

import { useState } from 'react';

interface Props {
  onAdd: (qty: number) => Promise<void> | void;
  defaultQty?: number;
  className?: string;
  disabled?: boolean;
}

export default function AddToCartButton({ onAdd, defaultQty = 1, className = '', disabled = false }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (disabled || loading) return;
    try {
    setLoading(true);
      await onAdd(defaultQty);
    } finally {
    setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-2 px-4 rounded-md font-semibold ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Memproses...' : 'Tambah ke Keranjang'}
      </button>
  );
}
