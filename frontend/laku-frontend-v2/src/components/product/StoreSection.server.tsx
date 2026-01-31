import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

export default function StoreSection({ seller, storeSlug }: any) {
  const store = seller || {
    name: 'Toko Official',
    logo: '',
    rating: 4.8,
    followers: 2500,
    productCount: 500,
    performance: { productQuality: 4.8, shippingSpeed: 4.7, customerService: 4.9 },
    badges: [],
  };

  // Use storeSlug if provided, otherwise derive from store name
  const slug = storeSlug || store.name?.toLowerCase().replace(/\s+/g, '-') || 'store-001';
  const storeLink = `/store/${slug}`;

  // Defensive: derive performance values safely
  const performance = {
    productQuality: store?.performance?.productQuality ?? store.rating ?? '-',
    shippingSpeed: store?.performance?.shippingSpeed ?? '-',
    customerService: store?.performance?.customerService ?? '-',
  };

  return (
    <div className="rounded-lg p-4 bg-white shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-4">
        <Link href={storeLink} className="flex-shrink-0 no-underline">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center shadow-md">
            {store.logo ? <Image src={store.logo} alt={store.name} width={64} height={64} className="rounded-lg" /> : <div className="w-8 h-8 text-white">T</div>}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={storeLink} className="no-underline">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-black text-sm sm:text-base truncate">{store.name}</h4>
            </div>
          </Link>

          <div className="flex items-center gap-2 text-sm sm:text-base">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star key={`star-${index}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm ml-1 font-semibold text-gray-500">{store.rating}</span>
            <span className="text-gray-500 text-xs sm:text-sm ml-2">{(store.followers / 1000).toFixed(1)}k pengikut</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="rounded-md p-3">
          <div className="text-base sm:text-lg font-bold text-red-600">{performance.productQuality}</div>
          <div className="text-xs sm:text-sm text-gray-500">Kualitas Produk</div>
        </div>
        <div className="rounded-md p-3">
          <div className="text-base sm:text-lg font-bold text-red-600">{performance.shippingSpeed}</div>
          <div className="text-xs sm:text-sm text-gray-500">Kecepatan Kirim</div>
        </div>
        <div className="rounded-md p-3">
          <div className="text-base sm:text-lg font-bold text-red-600">{performance.customerService}</div>
          <div className="text-xs sm:text-sm text-gray-500">Layanan Toko</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={storeLink} className="flex-1">
          <button className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-2 rounded-md font-semibold">Lihat Toko</button>
        </Link>
        <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md font-medium">Semua Produk</button>
      </div>
    </div>
  );
}

