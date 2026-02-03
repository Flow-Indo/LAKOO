import Image from 'next/image';
import { Truck, RotateCcw } from 'lucide-react';

interface Props {
  product: any;
}

export default function ProductDetails({ product }: Props) {
  return (
    <div className="space-y-4">
      {/* Shipping Info */}
      <div className="px-4 py-3 bg-orange-50 border-l-4 border-orange-400">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-600" />
            <span className="text-orange-900 text-xs sm:text-sm">Gratis Ongkir • Pengiriman 48 Jam</span>
          </div>
        </div>
      </div>

      {/* Return Policy */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-green-600" />
            <span className="text-xs sm:text-sm text-black font-medium">Garansi 7 Hari</span>
            <span className="text-xs sm:text-sm text-black">Pengembalian Gratis</span>
            <span className="text-xs sm:text-sm text-black">Refund Cepat</span>
          </div>
          <span className="text-gray-400">•</span>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-2 text-sm text-center">
          <div>
            <div className="text-gray-500 mb-1 text-xs">Gaya</div>
            <div className="font-medium text-xs sm:text-sm text-black">{product.style || 'Kasual'}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1 text-xs">Jenis</div>
            <div className="font-medium text-xs sm:text-sm text-black">{product.subcategory || 'Celana Olahraga'}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1 text-xs">Bahan</div>
            <div className="font-medium text-xs sm:text-sm text-black">{product.material || 'Katun'}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1 text-xs">Musim</div>
            <div className="font-medium text-xs sm:text-sm text-black">Semua Musim</div>
          </div>
        </div>
      </div>
    </div>
  );
}

