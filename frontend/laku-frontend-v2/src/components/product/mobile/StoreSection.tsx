import Image from 'next/image';
import Link from 'next/link';
import { Store, ShoppingBag } from 'lucide-react';

interface StoreSectionProps {
  seller: {
    id: string;
    name: string;
    logo?: string;
    rating: number;
    followers: number;
    badges?: string[];
    stats?: {
      newReviews?: string;
      storeAge?: string;
      vipAdditions?: string;
    };
    metrics: {
      productQuality: {
        score: number;
        level: 'Tinggi' | 'Sedang' | 'Rendah';
        detail: string;
      };
      shippingSpeed: {
        score: number;
        level: 'Tinggi' | 'Sedang' | 'Rendah';
        detail: string;
      };
      serviceQuality: {
        score: number;
        level: 'Tinggi' | 'Sedang' | 'Rendah';
        detail: string;
      };
    };
  };
}

export function StoreSection({ seller }: StoreSectionProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Tinggi':
        return 'text-red-600';
      case 'Sedang':
        return 'text-orange-500';
      case 'Rendah':
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Store Header */}
      <div className="p-4">
        {/* Top Row: Logo, Name, Badges, Follow Button */}
        <div className="flex items-start gap-4 mb-4">
          {/* Store Logo */}
          <Link href={`/store/${seller.id}`} className="flex-shrink-0">
            <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden">
              {seller.logo ? (
                <Image
                  src={seller.logo}
                  alt={seller.name}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {seller.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Store Info */}
          <div className="flex-1 min-w-0">
            {/* Name and Badges Row */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">{seller.name}</h3>
              {seller.badges && seller.badges.length > 0 && (
                <div className="flex gap-1">
                  {seller.badges.slice(0, 5).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rating and Followers Row */}
            <div className="flex items-center gap-3 mb-3">
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`${
                      i < Math.floor(seller.rating)
                        ? 'text-orange-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {/* Rating Number */}
              <span className="font-bold text-gray-900 text-xs sm:text-sm">{seller.rating}</span>
              {/* Followers */}
              <span className="text-gray-500 text-xs sm:text-sm">
                {seller.followers >= 10000
                  ? `${(seller.followers / 10000).toFixed(1).replace('.', ',')}rb pengikut`
                  : `${seller.followers.toLocaleString('id-ID')} pengikut`}
              </span>
            </div>

            {/* Stats Tags */}
            {seller.stats && (
              <div className="space-y-1">
                {seller.stats.newReviews && (
                <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {seller.stats.newReviews}
                  </div>
                )}
                {seller.stats.storeAge && (
                  <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {seller.stats.storeAge}
                  </div>
                )}
                {seller.stats.vipAdditions && (
                  <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {seller.stats.vipAdditions}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Follow Button */}
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-orange-600 transition-colors h-fit">
            + Ikuti
          </button>
        </div>

        {/* Metrics Grid - Better Spacing */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
          {/* Product Quality */}
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-600 mb-2">Kualitas Produk</div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className={`text-3xl font-bold ${getLevelColor(seller.metrics.productQuality.level)}`}>
                {seller.metrics.productQuality.score.toFixed(1)}
              </span>
              <span className={`text-xs sm:text-sm font-semibold ${getLevelColor(seller.metrics.productQuality.level)}`}>
                {seller.metrics.productQuality.level}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed px-1">
              {seller.metrics.productQuality.detail}
            </p>
          </div>

          {/* Shipping Speed */}
          <div className="text-center border-x border-gray-100">
            <div className="text-xs sm:text-sm text-gray-600 mb-2">Kecepatan Kirim</div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className={`text-3xl font-bold ${getLevelColor(seller.metrics.shippingSpeed.level)}`}>
                {seller.metrics.shippingSpeed.score.toFixed(1)}
              </span>
              <span className={`text-xs sm:text-sm font-semibold ${getLevelColor(seller.metrics.shippingSpeed.level)}`}>
                {seller.metrics.shippingSpeed.level}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed px-1">
              {seller.metrics.shippingSpeed.detail}
            </p>
          </div>

          {/* Service Quality */}
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-600 mb-2">Layanan Toko</div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className={`text-3xl font-bold ${getLevelColor(seller.metrics.serviceQuality.level)}`}>
                {seller.metrics.serviceQuality.score.toFixed(1)}
              </span>
              <span className={`text-xs sm:text-sm font-semibold ${getLevelColor(seller.metrics.serviceQuality.level)}`}>
                {seller.metrics.serviceQuality.level}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed px-1">
              {seller.metrics.serviceQuality.detail}
            </p>
          </div>
        </div>

        {/* Action Buttons - Better Sizing */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <Link href={`/store/${seller.id}`} className="block">
            <button className="w-full py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:from-orange-500 hover:to-yellow-500 transition-all shadow-sm">
              <Store className="w-4 h-4" />
              <span>Lihat Toko</span>
            </button>
          </Link>
          <Link href={`/store/${seller.id}/products`} className="block">
            <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all">
              <ShoppingBag className="w-4 h-4" />
              <span>Semua Produk</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

