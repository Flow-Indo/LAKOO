'use client';

import { Check } from 'lucide-react';
import CartSelectButton from './CartSelectButton';
import type { CartProduct, StoreCart } from '@/types/cart';
import { CartStoreAvatar } from './CartStoreAvatar';
import { CartStoreName } from './CartStoreName';
import { CartStoreVariations } from './CartStoreVariations';
import { CartStorePrice } from './CartStorePrice';
import CartTrash from './CartTrash';

interface Props {
  product: CartProduct;
  store: StoreCart;
  onToggle?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  onQuantityChange?: (productId: string, quantity: number) => void;
}

export function CartProductBody({ product, store, onToggle, onDelete, onQuantityChange }: Props) {
  return (
    <>
      <div className="px-4 pt-[15px] pb-[15px] flex items-center gap-3 border-b-0">
      <CartSelectButton
        selected={product.isSelected}
        onClick={() => onToggle && onToggle(product.id)}
        sizeClass="w-4 h-4 sm:w-6 sm:h-6"
        ariaLabel="Select product"
      />

      <div className="w-20 h-20 rounded-[5px] overflow-hidden flex-none">
        <img src={product.image} alt={product.name} className="object-cover w-full h-full block" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="relative">
          <CartStoreName name={product.name} />
          <div className="absolute top-0 right-0">
            <CartTrash
              onDelete={() => onDelete && onDelete(product.id)}
              quantity={product.quantity}
              onQuantityChange={(q: number) => onQuantityChange && onQuantityChange(product.id, q)}
            />
          </div>
        </div>
        <CartStoreVariations variations={product.variations} />

        <div className="mt-2 text-left">
          <CartStorePrice price={product.price} originalPrice={product.originalPrice} />
        </div>
      </div>
      {/* quantity is handled by CartTrash dropdown on the top-right */}
    </div>
    </>
  );
}

