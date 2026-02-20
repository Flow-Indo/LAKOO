'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

type Product = {
  id: string;
  title: string;
  price: number;
  image?: string;
  description?: string;
};

type Props = {
  open: boolean;
  product: Product;
  onClose: () => void;
};

export function ProductModal({ open, product, onClose }: Props) {
  const { t } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(product.image);
  const touchStartY = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  if (!open) return null;

  const handleBuyNow = () => {
    addItem({ id: product.id, title: product.title, price: product.price, stock: 99 } as any, 1);
    onClose();
    router.push('/checkout');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current || !sheetRef.current) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy > 0) {
      sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartY.current || !sheetRef.current) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    sheetRef.current.style.transform = '';
    touchStartY.current = null;
    if (dy > 120) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative w-full max-w-3xl bg-white rounded-t-xl shadow-xl p-4 transform translate-y-0 transition-transform duration-300 h-[70vh]"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">{product.title}</h3>
          <button onClick={onClose} className="text-gray-600 text-sm">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
          <div className="md:col-span-3 flex flex-col">
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
              {selectedImage ? (
                <img src={selectedImage} alt={product.title} className="object-contain max-h-full" />
              ) : (
                <div className="text-xs text-gray-500">No image</div>
              )}
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.image && (
                <img
                  src={product.image}
                  alt="thumb"
                  className="w-16 h-16 object-cover rounded-md cursor-pointer"
                  onClick={() => setSelectedImage(product.image)}
                />
              )}
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col">
            <div className="flex-1 overflow-y-auto text-sm text-gray-700">
              <p className="mb-3">{product.description || 'No description available.'}</p>
            </div>

            <div className="mt-4">
              <div className="text-lg font-semibold text-[#dc2626] mb-2">¥{product.price}</div>
              <Button size="lg" className="w-full bg-[#dc2626] text-white" onClick={handleBuyNow}>
                {t('action.buy_now')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

