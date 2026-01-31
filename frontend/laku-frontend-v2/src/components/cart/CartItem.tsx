'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2, Search as ScanSearch, Heart } from 'lucide-react';
import { CartPlusMinus } from './CartPlusMinus';
import type { CartProduct } from '@/types/cart';

interface Props {
  product: CartProduct;
  onUpdate: (product: CartProduct) => void;
  onDelete: () => void;
}

export function CartItem({ product, onUpdate, onDelete }: Props) {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > product.stock) return;
    onUpdate({ ...product, quantity: newQuantity });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-4 items-center">

        {/* Checkbox + Product Info */}
        <div className="col-span-12 md:col-span-6 flex items-start gap-4">
          <input
            type="checkbox"
            checked={product.isSelected}
            onChange={(e) => onUpdate({ ...product, isSelected: e.target.checked })}
            className="w-4 h-4 accent-red-500 flex-shrink-0"
          />

          <Image
            src={product.image}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-lg object-cover flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex w-full">
              <div className="flex-1 min-w-0 relative">
                <h3 className="text-sm text-gray-900 font-light line-clamp-1 mb-1 w-[150px]">
                  {product.name}
                </h3>
                {product.variations && (
                  <p className="text-xs text-gray-600 w-[300px]">{product.variations}</p>
                )}

                <div className="absolute top-0 right-0">
                  <button
                    onClick={onDelete}
                    aria-label="Hapus"
                    title="Hapus"
                    className="text-sm text-gray-900 hover:text-red-500 h-[53px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="absolute right-2 bottom-2 md:right-0 md:bottom-0 flex items-center gap-2">
                  {/* extracted to CartPlusMinus component */}
                  <CartPlusMinus
                    quantity={product.quantity}
                    onDecrease={() => handleQuantityChange(product.quantity - 1)}
                    onIncrease={() => handleQuantityChange(product.quantity + 1)}
                    disableDecrease={product.quantity <= 1}
                    disableIncrease={product.quantity >= product.stock}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Price */}
        <div className="col-span-3 md:col-span-2 text-center">
          <span className="text-sm text-gray-900">
            Rp{product.price.toLocaleString()}
          </span>
        </div>

        {/* Quantity Controls */}
        {/* Quantity controls moved into product info box */}

        {/* Total Price */}
        <div className="col-span-3 md:col-span-1 text-center">
          <span className="text-sm font-medium text-red-500">
            Rp{(product.price * product.quantity).toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="col-span-2 md:col-span-1 flex flex-col items-center gap-2">
          <button
            aria-label="Cari Serupa"
            className="text-sm text-red-500 hover:underline flex items-center justify-center w-8 h-8 rounded"
          >
            <ScanSearch className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}