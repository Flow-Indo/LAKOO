'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores';
import { ROUTES } from '@/constants';

export function CartSummary() {
  const { getTotalItems, getTotalPrice, getTotalDiscount, items } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const discount = getTotalDiscount();
  const shipping = subtotal > 500000 ? 0 : 25000; // Free shipping over 500k
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span>Items ({getTotalItems()})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <Link href={ROUTES.CHECKOUT}>
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>

        <Link href={ROUTES.PRODUCTS}>
          <Button variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {subtotal < 500000 && (
        <p className="text-sm text-gray-600 mt-4 text-center">
          Add {formatPrice(500000 - subtotal)} more for free shipping
        </p>
      )}
    </div>
  );
}