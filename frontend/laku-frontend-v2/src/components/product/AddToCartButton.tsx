'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { Product } from '@/types';
import { showToast } from '@/components/ui/toast';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    try {
      addItem(product);
      showToast.success(`${product.name} berhasil ditambahkan ke keranjang!`);
    } catch (error) {
      showToast.error('Gagal menambahkan produk ke keranjang');
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={`w-full bg-red-600 hover:bg-red-700 text-white ${className}`}
      size="sm"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Tambah ke Keranjang
    </Button>
  );
}