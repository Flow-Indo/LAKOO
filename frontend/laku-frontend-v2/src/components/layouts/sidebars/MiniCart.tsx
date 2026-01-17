'use client';

import Link from 'next/link';
import { useCart } from '@/providers/cart-provider';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package } from 'lucide-react';

export function MiniCart() {
  const cartData = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalItems = cartData?.items?.length || 0;
  const totalPrice = cartData?.getTotalPrice() || 0;
  const totalDiscount = cartData?.getTotalDiscount() || 0;

  return (
    <div className="space-y-4">
      {/* Cart Header */}
      <div className="flex items-center space-x-2">
        <ShoppingCart className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Cart Summary</h3>
      </div>

      {/* Cart Content */}
      {totalItems > 0 ? (
        <div className="space-y-3">
          {/* Item Count */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Items</span>
            <span className="font-medium text-gray-900">{totalItems}</span>
          </div>

          {/* Total Price */}
          <div className="space-y-1">
            {totalDiscount > 0 && (
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice + totalDiscount)}</span>
              </div>
            )}
            {totalDiscount > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(totalDiscount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm font-semibold text-gray-900 pt-1 border-t border-gray-200">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* View Cart Button */}
          <Button asChild className="w-full">
            <Link href="/cart">
              View Cart
            </Link>
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Your cart is empty</p>
          <Button asChild variant="outline" className="mt-3">
            <Link href="/products">
              Start Shopping
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}