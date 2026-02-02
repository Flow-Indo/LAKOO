'use client';

import { useState } from 'react';
import { Ticket, ChevronDown, Check, Clock } from 'lucide-react';
import { Voucher } from '@/types/checkout';

interface VoucherSectionProps {
  vouchers: Voucher[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function VoucherSection({
  vouchers,
  selected,
  onSelect,
}: VoucherSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedVoucher = vouchers.find(v => v.id === selected);

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === 'percentage') {
      return `${voucher.discount}%`;
    }
    return `Rp ${voucher.discount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="py-4">
      <h3 className="text-[15px] font-semibold text-gray-900">Voucher Toko</h3>

      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Ticket className="h-5 w-5 text-orange-500" />
          <div className="text-left">
            {selectedVoucher ? (
              <>
                <p className="text-sm font-medium text-gray-900">
                  {selectedVoucher.code}
                </p>
                <p className="text-xs text-gray-500">
                  Hemat {formatDiscount(selectedVoucher)}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Pilih voucher toko</p>
            )}
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm">
          {/* No Voucher Option */}
          <button
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
              !selected ? 'bg-[#FFF0F3]' : ''
            }`}
          >
            <span className="text-sm text-gray-600">Tidak pakai voucher</span>
            {!selected && <Check className="h-5 w-5 text-[#FF2442]" />}
          </button>

          {/* Voucher Options */}
          {vouchers.map((voucher) => (
            <button
              key={voucher.id}
              onClick={() => {
                onSelect(voucher.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-start justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                selected === voucher.id ? 'bg-[#FFF0F3]' : ''
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <Ticket className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {voucher.code}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Diskon {formatDiscount(voucher)}
                    {voucher.minPurchase && ` • Min. Rp ${voucher.minPurchase.toLocaleString('id-ID')}`}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                    <Clock className="h-3 w-3" />
                    <span>Berlaku hingga 31 Des 2026</span>
                  </div>
                </div>
              </div>
              {selected === voucher.id && (
                <Check className="h-5 w-5 text-[#FF2442] ml-2" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
