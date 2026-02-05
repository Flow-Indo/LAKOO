import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface SizeHelperProps {
  recommendedSize: string;
  sizeChart: Array<{
    size: string;
    height: string;
    weight: string;
    waist: string;
    hip: string;
    inseam: string;
  }>;
  buyerReferences: Array<{
    avatar: string;
    name: string;
    height: string;
    weight: string;
    purchasedSize: string;
  }>;
}

export function SizeHelper({ recommendedSize, sizeChart, buyerReferences }: SizeHelperProps) {
  const measurementRows = [
    { key: 'height', label: 'Tinggi' },
    { key: 'weight', label: 'Berat' },
    { key: 'waist', label: 'Pinggang' },
    { key: 'hip', label: 'Pinggul' },
    { key: 'inseam', label: 'Panjang' },
  ];

  return (
    <div className="px-4 py-4 border-t border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <h3 className="font-semibold text-gray-900 text-[16px] truncate flex-1">Ukuran</h3>
        <div className="py-2 text-xs sm:text-sm text-gray-600 flex items-center gap-2 flex-shrink-0 ml-3">
          <span>Saya <span className="font-medium">Tinggi 162cm | Berat 61kg</span></span>
          <button className="text-red-600 ml-2 font-medium text-xs py-1 px-2 rounded">Edit</button>
        </div>
      </div>

      {/* Size Recommendation */}
      <div className="bg-orange-50 rounded-lg p-3 mb-6 border-l-4 border-orange-400">
        <p className="text-sm text-center text-gray-600">
          <span className="font-semibold text-gray-600">78% pembeli</span> memilih ukuran standar,&nbsp;
          rekomendasi <span className="text-red-600 font-bold text-lg">{recommendedSize}</span>
        </p>
      </div>

      {/* Fit Indicator Slider - NEW */}
      <div className="py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Model</span>
        </div>
        <div className="relative">
          <div className="h-1.5 bg-gray-200 rounded-full relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-orange-500 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-gray-400">Sangat Ketat</span>
            <span className="text-gray-400">Ketat</span>
            <span className="text-gray-400">Pas</span>
            <span className="text-orange-500 font-semibold">Longgar</span>
            <span className="text-gray-400">Sangat Longgar</span>
          </div>
        </div>
      </div>

      {/* Size Chart Title */}
      <h4 className="font-medium text-gray-900 mb-8 text-sm">Tabel Ukuran <span className="text-gray-500 font-normal">cm/kg</span></h4>

      {/* Transposed Size Chart: sizes as columns, measurements as rows */}
      <div className="overflow-x-auto py-4">
        <div className="px-4">
          <table className="w-full min-w-[320px] text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 px-2 font-semibold text-gray-900">Ukuran</th>
                {sizeChart.map((s) => (
                  <th
                    key={s.size}
                    className={`text-center py-2 px-2 font-semibold ${s.size === recommendedSize ? 'text-red-600' : 'text-gray-900'}`}
                  >
                    {s.size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {measurementRows.map((m) => (
                <tr key={m.key} className="border-b border-gray-200">
                  <td className="py-2 px-2 font-semibold text-gray-900">{m.label}</td>
                  {sizeChart.map((s) => (
                    <td key={`${m.key}-${s.size}`} className="text-center py-2 px-2 text-gray-900">
                      {/* @ts-expect-error dynamic key */}
                      {s[m.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buyer Size Reference - TABLE LAYOUT */}
      <h4 className="font-medium text-gray-900 mb-4">Referensi Ukuran Pembeli</h4>

      <div className="bg-white rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-4 gap-2 bg-gray-50 py-2 px-3 text-xs text-gray-600 font-medium">
          <div>Pembeli</div>
          <div className="text-center">Tinggi·cm</div>
          <div className="text-center">Berat·kg</div>
          <div className="text-center">Ukuran</div>
        </div>

        {buyerReferences.map((buyer, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-2 items-center py-3 px-3 border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={buyer.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(buyer.name)}`}
                  alt={buyer.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-sm text-gray-900">{buyer.name}</span>
            </div>

            <div className="text-center text-sm text-gray-900">{buyer.height}</div>

            <div className="text-center text-sm text-gray-900">{buyer.weight}</div>

            <div className="text-center">
              <span className="text-sm font-semibold text-red-600">{buyer.purchasedSize}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="text-gray-500 text-sm flex items-center justify-center gap-1 w-full py-2 mt-4">
        Lihat Semua Ukuran
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

