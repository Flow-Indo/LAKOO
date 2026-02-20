'use client';

import { useRouter } from 'next/navigation';
import { MapPin, ChevronRight } from 'lucide-react';

interface AddressSectionProps {
  onSelectAddress?: () => void;
}

export default function AddressSection({ onSelectAddress }: AddressSectionProps) {
  const router = useRouter();

  // Mock address data - will be replaced with real user address from context/store
  const defaultAddress = {
    recipientName: 'John Doe',
    phone: '+62 812-3456-7890',
    fullAddress: 'Jl. Sudirman No. 123, Kelurahan Senayan, Kecamatan Kebayoran Baru',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postalCode: '12190',
  };

  const handleAddressClick = () => {
    if (onSelectAddress) {
      onSelectAddress();
    } else {
      router.push('/address');
    }
  };

  return (
    <div className="px-4 py-0 bg-white border-b border-gray-200">
      <button
        onClick={handleAddressClick}
        className="w-full flex items-start gap-3 text-left hover:bg-gray-50 transition-colors rounded-lg p-3 -mx-3"
      >
        <MapPin className="h-5 w-5 text-[#FF2442] flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900">
              {defaultAddress.recipientName}
            </span>
            <span className="text-sm text-gray-600">
              {defaultAddress.phone}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {defaultAddress.fullAddress}
          </p>
          <p className="text-sm text-gray-600 mt-0.5">
            {defaultAddress.city}, {defaultAddress.province} {defaultAddress.postalCode}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
      </button>
    </div>
  );
}
