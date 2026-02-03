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
    <div className="px-0 py-2 bg-white border-b border-gray-200">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 text-left hover:bg-gray-50 transition-colors rounded-lg p-3 -mx-3"
      >
        <Truck className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0 text-left">
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
            <p className="text-sm text-gray-900">Pilih opsi pengiriman</p>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
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
              className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-3 ${
                selected === option.id ? 'bg-[#FFF0F3]' : ''
              }`}
            >
              <Truck className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">
                  {option.courier} {option.service}
                </p>
                <p className="text-xs text-gray-500">
                  Estimasi {option.estimatedDays}
                </p>
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
              </div>
              {selected === option.id && (
                <Check className="h-5 w-5 text-[#FF2442] flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
