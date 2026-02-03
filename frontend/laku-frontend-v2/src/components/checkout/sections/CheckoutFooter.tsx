'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutFooterProps {
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  onCheckout: () => void;
  canCheckout: boolean;
}

export default function CheckoutFooter({
  pricing,
  onCheckout,
  canCheckout,
}: CheckoutFooterProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Price Details (Collapsible) */}
      {showDetails && (
        <div className="px-6 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal Produk</span>
            <span>{formatPrice(pricing.subtotal)}</span>
          </div>
          {pricing.discount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Diskon Voucher</span>
              <span>-{formatPrice(pricing.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Biaya Pengiriman</span>
            <span>{formatPrice(pricing.shipping)}</span>
          </div>
          <div className="pb-3 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(pricing.total)}</span>
          </div>
          <div className="h-px bg-gray-200" />
        </div>
      )}

      {/* Footer Bar */}
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Total Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <span>Detail</span>
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <div className="h-6 w-px bg-gray-300" />

          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-bold text-[#FF2442]">
              {formatPrice(pricing.total)}
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          disabled={!canCheckout}
          className="px-8 py-6 text-base font-medium bg-[#FF2442] hover:bg-[#E61E3A] text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full"
        >
          Bayar
        </Button>
      </div>
    </div>
  );
}
