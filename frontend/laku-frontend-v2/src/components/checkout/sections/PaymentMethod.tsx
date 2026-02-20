'use client';

import { useState } from 'react';
import { CreditCard, Wallet, Building2, ChevronDown, Check } from 'lucide-react';
import { PaymentMethod as PaymentMethodType } from '@/types/checkout';

interface PaymentMethodProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

const PAYMENT_METHODS: PaymentMethodType[] = [
  { id: 'gopay', name: 'GoPay', icon: 'wallet' },
  { id: 'ovo', name: 'OVO', icon: 'wallet' },
  { id: 'dana', name: 'DANA', icon: 'wallet' },
  { id: 'shopeepay', name: 'ShopeePay', icon: 'wallet' },
  { id: 'bca', name: 'Transfer BCA', icon: 'bank' },
  { id: 'mandiri', name: 'Transfer Mandiri', icon: 'bank' },
  { id: 'bni', name: 'Transfer BNI', icon: 'bank' },
  { id: 'bri', name: 'Transfer BRI', icon: 'bank' },
  { id: 'credit_card', name: 'Kartu Kredit/Debit', icon: 'card' },
  { id: 'indomaret', name: 'Indomaret', icon: 'store' },
  { id: 'alfamart', name: 'Alfamart', icon: 'store' },
];

export default function PaymentMethod({ selected, onSelect }: PaymentMethodProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === selected);

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'wallet':
        return <Wallet className="h-5 w-5 text-blue-500" />;
      case 'bank':
        return <Building2 className="h-5 w-5 text-gray-600" />;
      case 'card':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="px-0 py-2 bg-white">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 text-left hover:bg-gray-50 transition-colors rounded-lg p-3 -mx-3"
      >
        <div className="flex items-center gap-3 flex-1">
          {selectedMethod ? (
            <>
              {getIcon(selectedMethod.icon)}
              <span className="text-sm font-medium text-gray-900">
                {selectedMethod.name}
              </span>
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-900">Pilih metode pembayaran</span>
            </>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm max-h-[300px] overflow-y-auto">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => {
                onSelect(method.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-3 ${
                selected === method.id ? 'bg-[#FFF0F3]' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                {getIcon(method.icon)}
                <span className="text-sm font-medium text-gray-900">
                  {method.name}
                </span>
              </div>
              {selected === method.id && (
                <Check className="h-5 w-5 text-[#FF2442] flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
