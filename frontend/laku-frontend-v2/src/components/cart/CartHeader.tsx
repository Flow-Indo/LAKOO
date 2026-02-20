import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

type Tab = 'cart' | 'fitting';

interface CartHeaderProps {
  count?: number;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

export function CartHeader({ count = 0, activeTab = 'cart', onTabChange }: CartHeaderProps) {
  return (
    <div className="sticky top-0 z-60 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-900">
          Keranjang Belanja <span className="text-sm text-gray-600">({count})</span>
        </h1>

        <Link href="/messages" className="p-2" aria-label="Messages">
          <MessageCircle className="w-5 h-5 text-gray-700" />
        </Link>
      </div>
      {/* thin indicator line under the header container */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gray-100" />
      </div>

      {/* Tabs: Cart / Fitting */}
      <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 pt-1.5 pb-1.5 flex items-center justify-center gap-10" style={{ height: '44px' }}>
            <button
              onClick={() => onTabChange && onTabChange('cart')}
              className={`text-base h-11 ${activeTab === 'cart' ? 'text-gray-900 font-medium border-b-2 border-gray-900 pb-0' : 'text-gray-600 font-medium'}`}
            >
              Cart
            </button>
            <button
              onClick={() => onTabChange && onTabChange('fitting')}
              className={`text-base h-11 ${activeTab === 'fitting' ? 'text-gray-900 font-medium border-b-2 border-gray-900 pb-0' : 'text-gray-600 font-medium'}`}
              style={{ fontFamily: 'cursive' }}
            >
              Fitting
            </button>
        </div>
      </div>

      {/* Table Header - Desktop Only */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-3 border-t border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-sm text-gray-600">
          <div className="col-span-1 flex items-center">
            <input type="checkbox" className="w-4 h-4" />
          </div>
          <div className="col-span-5">Produk</div>
          <div className="col-span-2 text-center">Harga Satuan</div>
          <div className="col-span-2 text-center">Kuantitas</div>
          <div className="col-span-1 text-center">Total Harga</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>
      </div>
    </div>
  );
}