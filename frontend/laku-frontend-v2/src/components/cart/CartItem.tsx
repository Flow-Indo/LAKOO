'use client';

import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
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
        <div className="col-span-12 md:col-span-6 flex items-center gap-4">
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
            <h3 className="text-sm text-gray-900 font-medium line-clamp-2 mb-1">
              {product.name}
            </h3>
            {product.variations && (
              <p className="text-xs text-gray-600">{product.variations}</p>
            )}
            {product.originalPrice && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-gray-600 line-through">
                  Rp{product.originalPrice.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Unit Price */}
        <div className="col-span-3 md:col-span-2 text-center">
          <span className="text-sm text-gray-900">
            Rp{product.price.toLocaleString()}
          </span>
        </div>

        {/* Quantity Controls */}
        <div className="col-span-4 md:col-span-2 flex items-center justify-center gap-2">
          <button
            onClick={() => handleQuantityChange(product.quantity - 1)}
            disabled={product.quantity <= 1}
            className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>

          <input
            type="text"
            value={product.quantity}
            readOnly
            className="w-12 h-8 text-center border border-gray-200 rounded text-sm"
          />

          <button
            onClick={() => handleQuantityChange(product.quantity + 1)}
            disabled={product.quantity >= product.stock}
            className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Total Price */}
        <div className="col-span-3 md:col-span-1 text-center">
          <span className="text-sm font-medium text-red-500">
            Rp{(product.price * product.quantity).toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="col-span-2 md:col-span-1 flex flex-col items-center gap-2">
          <button
            onClick={onDelete}
            className="text-sm text-gray-900 hover:text-red-500"
          >
            Hapus
          </button>
          <button className="text-sm text-red-500 hover:underline">
            Cari Serupa
          </button>
        </div>

      </div>
    </div>
  );
}