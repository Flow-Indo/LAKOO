'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { Product } from '@/types';
import { showToast } from '@/components/ui/toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useLanguage();

  const handleAddToCart = () => {
    try {
      addItem(product);
      showToast.success(t('cart.add_success', { product: product.name }));
    } catch (error) {
      showToast.error(t('cart.add_error'));
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={`w-full bg-red-600 hover:bg-red-700 text-white ${className}`}
      size="sm"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {t('action.add_to_cart')}
    </Button>
  );
}