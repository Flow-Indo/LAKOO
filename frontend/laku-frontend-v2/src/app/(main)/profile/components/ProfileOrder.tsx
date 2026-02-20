import React from 'react';
import { Wallet, PackageCheck, Truck, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileOrder() {
  const router = useRouter();
  const items = [
    { label: 'Belum Bayar', icon: <Wallet className="w-6 h-6 text-gray-900" /> },
    { label: 'Dikemas', icon: <PackageCheck className="w-6 h-6 text-gray-900" /> },
    { label: 'Dikirim', icon: <Truck className="w-6 h-6 text-gray-900" /> },
    { label: 'Beri Penilaian', icon: <Star className="w-6 h-6 text-gray-900" /> },
  ];

  return (
    <div className="mt-4 px-4 py-4">
      <div>
        <div className="flex items-center justify-between mb-2.5 h-10">
          <h3 className="text-base font-semibold text-gray-900">Pesanan Saya</h3>
          <button
            type="button"
            onClick={() => router.push('/orders?status=completed')}
            className="text-sm text-gray-500"
          >
            Lihat Riwayat Pesanan &gt;
          </button>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-x-2.5 gap-y-2.5">
          {items.map(({ label, icon }, idx) => {
            const handleClick = () => {
              // map labels to orders status query param keys
              const mapLabelToStatus: Record<string, string> = {
                'Belum Bayar': 'toPay',
                Dikemas: 'toShip',
                Dikirim: 'toReceive',
                'Beri Penilaian': 'toReview',
              };

              const key = mapLabelToStatus[label as keyof typeof mapLabelToStatus] || 'all';
              const url = key === 'all' ? '/orders' : `/orders?status=${key}`;
              router.push(url);
            };

            return (
              <button
                key={idx}
                type="button"
                onClick={handleClick}
                className="flex flex-col items-center text-center bg-transparent border-0 p-0"
              >
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-2.5">
                  {icon}
                </div>
                <div className="text-xs text-gray-600">{label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}