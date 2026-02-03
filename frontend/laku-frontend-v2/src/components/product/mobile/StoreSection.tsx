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
  sold?: number;
}

export function StoreSection({ seller, sold }: StoreSectionProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Tinggi':
        return 'text-[#FF2442]';
      case 'Sedang':
        return 'text-[#FF6B7A]';
      case 'Rendah':
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  };

  const formatFollowers = (num: number) => {
    if (num >= 10000) {
      const formatted = (num / 10000).toFixed(1).replace('.', ',');
      return formatted.endsWith(',0') 
        ? formatted.replace(',0', '') + 'rb' 
        : formatted + 'rb';
    }
    return num.toLocaleString('id-ID');
  };

  const formatSold = (num: number) => {
    if (num >= 1000) {
      const formatted = (num / 1000).toFixed(1);
      return formatted.endsWith('.0') 
        ? formatted.replace('.0', '') + 'rb' 
        : formatted + 'rb';
    }
    return num.toLocaleString('id-ID');
  };

  return (
    <div>
      <div className="p-0">
        <div className="p-2 flex items-start gap-4 mb-4">
          <Link href={`/store/${seller.id}`} className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
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
                  <span className="text-white text-[20px] font-bold">
                    {seller.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="pb-0.5 flex items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-[16px] sm:text-[14px]">{seller.name}</h3>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`${
                      i < Math.floor(seller.rating)
                        ? 'text-[#FF2442]'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-500 text-[12px] sm:text-[14px]">{seller.rating}</span>
            </div>

            <div className="pt-0.5 text-gray-500 text-[12px] sm:text-[14px] whitespace-nowrap">
              {formatFollowers(seller.followers)}+ Pengikut {sold != null && <span className="mx-1">•</span>} {sold != null && `${formatSold(sold)}+ Terjual`}
            </div>
          </div>

          <button className="px-4 py-2 bg-[#FF2442] text-white rounded-lg text-[14px] font-semibold whitespace-nowrap hover:bg-[#E61E3A] transition-colors h-fit">
            + Ikuti
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 py-4">
          <div className="text-center">
            <div className="text-[12px] sm:text-[14px] text-gray-600 mb-2">Kualitas Produk</div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className={`text-[30px] font-bold ${getLevelColor(seller.metrics.productQuality.level)}`}>
                {seller.metrics.productQuality.score.toFixed(1)}
              </span>
              <span className={`text-[12px] sm:text-[14px] font-semibold ${getLevelColor(seller.metrics.productQuality.level)}`}>
                {seller.metrics.productQuality.level}
              </span>
            </div>
            <p className="text-[12px] sm:text-[14px] text-gray-500 leading-relaxed px-1">
              {seller.metrics.productQuality.detail}
            </p>
          </div>

          <div className="text-center border-x border-gray-100">
            <div className="text-[12px] sm:text-[14px] text-gray-600 mb-2">Kecepatan Kirim</div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className={`text-[30px] font-bold ${getLevelColor(seller.metrics.shippingSpeed.level)}`}>
                {seller.metrics.shippingSpeed.score.toFixed(1)}
              </span>
              <span className={`text-[12px] sm:text-[14px] font-semibold ${getLevelColor(seller.metrics.shippingSpeed.level)}`}>
                {seller.metrics.shippingSpeed.level}
              </span>
            </div>
            <p className="text-[12px] sm:text-[14px] text-gray-500 leading-relaxed px-1">
              {seller.metrics.shippingSpeed.detail}
            </p>
          </div>

          <div className="text-center">
            <div className="text-[12px] sm:text-[14px] text-gray-600 mb-2">Layanan Toko</div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className={`text-[30px] font-bold ${getLevelColor(seller.metrics.serviceQuality.level)}`}>
                {seller.metrics.serviceQuality.score.toFixed(1)}
              </span>
              <span className={`text-[12px] sm:text-[14px] font-semibold ${getLevelColor(seller.metrics.serviceQuality.level)}`}>
                {seller.metrics.serviceQuality.level}
              </span>
            </div>
            <p className="text-[12px] sm:text-[14px] text-gray-500 leading-relaxed px-1">
              {seller.metrics.serviceQuality.detail}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <Link href={`/store/${seller.id}`} className="block">
            <button className="w-full py-3 bg-[#FF2442] text-white rounded-lg font-semibold text-[12px] sm:text-[14px] flex items-center justify-center gap-2 hover:bg-[#E61E3A] transition-all shadow-sm">
              <Store className="w-4 h-4" />
              <span>Lihat Toko</span>
            </button>
          </Link>
          <Link href={`/store/${seller.id}/products`} className="block">
            <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium text-[12px] sm:text-[14px] flex items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all">
              <ShoppingBag className="w-4 h-4" />
              <span>Semua Produk</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
