'use client';

import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CartTotalSticky from './CartTotalSticky';
import { BottomNav } from '@/components/layouts/BottomNav';

export function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const selectAllStore = useCartStore(state => state.selectAll);
  const clearSelection = useCartStore(state => state.clearSelection);
  const selectedCount = useCartStore(state => state.getSelectedCount());
  const selectedTotal = useCartStore(state => state.getSelectedTotalPrice());

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.store.name}</p>
                <p className="text-lg font-bold">Rp {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {getTotalPrice().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rp 0</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rp {getTotalPrice().toLocaleString()}</span>
            </div>
          </div>
          <Link href="/checkout" className="w-full">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
          <button
            onClick={clearCart}
            className="w-full mt-2 text-gray-500 hover:text-gray-700"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
    <>
      </div>

      {/* Mobile sticky cart total + bottom nav */}
      <CartTotalSticky
        selectAll={selectedCount > 0 && selectedCount === items.length && items.length > 0}
        onSelectAll={(checked: boolean) => {
          if (checked) selectAllStore();
          else clearSelection();
        }}
        summary={{ selectedCount, total: selectedTotal } as any}
        onCheckout={() => router.push('/checkout')}
      />

      <BottomNav />
    </>
  );
}