'use client';

import { Truck, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ProductShipping } from '@/types/product';

interface Props {
  shipping: ProductShipping;
}

export function ProductShippingInfo({ shipping }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white mx-4 rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Truck className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Shipping to {shipping.destination}</p>
            <p className="text-sm text-gray-600">
              {shipping.free ? 'Free Shipping' : shipping.method} • {shipping.estimatedDelivery}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{shipping.method}</p>
                <p className="text-sm text-gray-600">Estimated {shipping.estimatedDelivery}</p>
              </div>
              <div className="text-right">
                {shipping.free ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : (
                  <span className="font-semibold">
                    Rp{shipping.cost?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Express Shipping</span>
                <span>Rp 25,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Standard Shipping</span>
                <span>Rp 15,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Economy Shipping</span>
                <span>Rp 8,000</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}