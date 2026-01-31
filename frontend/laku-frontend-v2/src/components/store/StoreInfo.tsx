'use client';

import { MapPin, Star, Users, Package, Instagram, Globe } from 'lucide-react';
import type { StoreData } from '@/types/store';

interface StoreInfoProps {
  store: StoreData;
}

export default function StoreInfo({ store }: StoreInfoProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
    return num.toString();
  };

  return (
    <div className="py-6 border-b border-gray-100">
      {/* Description */}
      <p className="text-sm text-gray-700 leading-relaxed mb-6">
        {store.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-900 font-semibold mb-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{store.rating}</span>
          </div>
          <p className="text-xs text-gray-500">Rating</p>
        </div>

        <div className="text-center">
          <div className="text-gray-900 font-semibold mb-1">
            {formatNumber(store.followers)}
          </div>
          <p className="text-xs text-gray-500">Pengikut</p>
        </div>

        <div className="text-center">
          <div className="text-gray-900 font-semibold mb-1">
            {store.productsCount}
          </div>
          <p className="text-xs text-gray-500">Produk</p>
        </div>

        <div className="text-center">
          <div className="text-gray-900 font-semibold mb-1">
            {store.story.founded}
          </div>
          <p className="text-xs text-gray-500">Berdiri</p>
        </div>
      </div>

      {/* Location & Social */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{store.location}</span>
        </div>

        {store.instagram && (
          <a
            href={`https://instagram.com/${store.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Instagram className="w-4 h-4 text-gray-400" />
            <span>{store.instagram}</span>
          </a>
        )}

        {store.website && (
          <a
            href={store.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Globe className="w-4 h-4 text-gray-400" />
            <span>Kunjungi Website</span>
          </a>
        )}
      </div>

      {/* Follow Button */}
      <button className="w-full mt-6 py-3 bg-[#ff2742] text-white rounded-lg font-medium hover:bg-[#e61e3a] transition-colors">
        + Ikuti Toko
      </button>
    </div>
  );
}
