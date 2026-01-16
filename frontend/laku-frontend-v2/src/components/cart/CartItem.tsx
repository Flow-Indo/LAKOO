'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores';
import { ROUTES } from '@/constants';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
      <Link href={ROUTES.PRODUCT(item.slug)} className="flex-shrink-0">
        <div className="relative w-20 h-20">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded"
            sizes="80px"
          />
        </div>
      </Link>

      <div className="flex-grow">
        <Link href={ROUTES.PRODUCT(item.slug)}>
          <h3 className="font-semibold hover:text-blue-600 line-clamp-2">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600">{item.store.name}</p>
        <p className="font-semibold text-green-600">{formatPrice(item.price)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </Button>
        <span className="w-12 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.stock}
        >
          +
        </Button>
      </div>

      <div className="text-right">
        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}