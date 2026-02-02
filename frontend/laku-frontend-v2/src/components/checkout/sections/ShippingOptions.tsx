'use client';

import { useState } from 'react';
import { Truck, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShippingOption } from '@/types/checkout';

interface ShippingOptionsProps {
  options: ShippingOption[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function ShippingOptions({
  options,
  selected,
  onSelect,
}: ShippingOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(o => o.id === selected);

  return (
    <div className="py-4">
      <h3 className="text-[15px] font-semibold text-gray-900">Opsi Pengiriman</h3>

      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-gray-400" />
          <div className="text-left">
            {selectedOption ? (
              <>
                <p className="text-sm font-medium text-gray-900">
                  {selectedOption.courier} {selectedOption.service}
                </p>
                <p className="text-xs text-gray-500">
                  Estimasi {selectedOption.estimatedDays} • Rp {selectedOption.price.toLocaleString('id-ID')}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Pilih opsi pengiriman</p>
            )}
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                selected === option.id ? 'bg-[#FFF0F3]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-gray-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {option.courier} {option.service}
                  </p>
                  <p className="text-xs text-gray-500">
                    Estimasi {option.estimatedDays}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {option.isFast && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">
                    Cepat
                  </span>
                )}
                <span className="text-sm font-medium text-gray-900">
                  {option.isFree ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    `Rp ${option.price.toLocaleString('id-ID')}`
                  )}
                </span>
                {selected === option.id && (
                  <Check className="h-5 w-5 text-[#FF2442]" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
