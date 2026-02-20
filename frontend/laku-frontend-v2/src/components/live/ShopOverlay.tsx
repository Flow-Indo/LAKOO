'use client';

import Image from 'next/image';
import { Check, Star, Users } from 'lucide-react';
import type { LiveShop } from '@/types/live-shopping';

interface Props {
  shop: LiveShop;
  isLive?: boolean;
  viewerCount?: number;
  onFollow: () => void;
}

export function ShopOverlay({ shop, isLive, viewerCount, onFollow }: Props) {
  return (
    <div className="absolute top-20 left-0 right-0 px-4 z-10">
      {/* Add background overlay to shop info for better visibility */}
      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3">
        <div className="flex items-center gap-3">

        {/* Shop Logo */}
        <div className="relative">
          <Image
            src={shop.logo}
            alt={shop.name}
            width={48}
            height={48}
            className="rounded-full border-2 border-white"
          />
          {shop.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Shop Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate">
            {shop.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-white/90">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{shop.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{(shop.followers / 1000).toFixed(1)}K</span>
            </div>
            {isLive && viewerCount && (
              <span className="px-2 py-0.5 bg-red-600 rounded text-white font-semibold">
                🔴 {viewerCount.toLocaleString()} watching
              </span>
            )}
          </div>
        </div>

        {/* Follow Button */}
        {!shop.isFollowing && (
          <button
            onClick={onFollow}
            className="px-6 py-2 bg-white/90 backdrop-blur-md text-black font-semibold rounded-full text-sm hover:bg-white transition flex-shrink-0 border border-white/20"
          >
            + Follow
          </button>
        )}

        </div>
      </div>
    </div>
  );
}