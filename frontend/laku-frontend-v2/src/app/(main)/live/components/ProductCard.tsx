'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ProductModal } from './ProductModal';

type Props = {
  product?: {
    id: string;
    title: string;
    price: number;
    image?: string;
  } | undefined;
};

export function ProductCard({ product }: Props) {
  const { t } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const [open, setOpen] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    // Minimal product shape for cart store
    addItem({ id: product.id, title: product.title, price: product.price, stock: 99 } as any, 1);
  };

  return (
    <div className="absolute left-0 right-0 bottom-0 z-60 p-4">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-4">
        <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded-lg" />
        <div className="flex-1">
          <div className="text-sm text-gray-700">{product.title}</div>
          <div className="text-xl font-bold text-red-600">¥{product.price}</div>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <Button size="sm" onClick={handleAdd} className="bg-red-600 text-white rounded-full px-4 py-2">
            {t('action.add_to_cart')}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="text-sm border border-gray-200">
            {t('action.view_details')}
          </Button>
        </div>
      </div>
      <ProductModal open={open} product={{ id: product.id, title: product.title, price: product.price, image: product.image, description: '' }} onClose={() => setOpen(false)} />
    </div>
  );
}

