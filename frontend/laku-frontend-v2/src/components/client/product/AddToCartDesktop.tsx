'use client';

import AddToCartButton from './AddToCartButton';

interface Props {
  productId: string;
  defaultQty?: number;
  className?: string;
}

export default function AddToCartDesktop({ productId, defaultQty = 1, className = '' }: Props) {
  async function handleAdd(qty: number) {
    try {
      // Example client-side add-to-cart flow — replace with real API call as needed
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty }),
      });
      // Simple UX feedback
      alert('Produk berhasil ditambahkan ke keranjang');
    } catch (err) {
      console.error('Failed to add to cart', err);
      alert('Gagal menambahkan ke keranjang');
    }
  }

  return <AddToCartButton defaultQty={defaultQty} onAdd={handleAdd} className={className} />;
}

