'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui';
import { Address } from '@/types';

export function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [address, setAddress] = useState<Partial<Address>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // TODO: Implement order submission
    console.log('Submitting order:', { items, address, total: getTotalPrice() });

    // Simulate API call
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      // TODO: Redirect to success page
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">No Items to Checkout</h1>
        <p className="text-gray-600">Add some products to your cart first!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={address.name || ''}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  className="w-full p-2 border rounded"
                  value={address.phone || ''}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded"
                value={address.street || ''}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={address.city || ''}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Province</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={address.province || ''}
                  onChange={(e) => setAddress({ ...address, province: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={address.postalCode || ''}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-4 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">Rp {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <hr className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rp {getTotalPrice().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}