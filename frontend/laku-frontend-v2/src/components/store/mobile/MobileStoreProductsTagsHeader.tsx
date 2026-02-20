 'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Share, Search } from 'lucide-react';
import Image from 'next/image';
import { Store } from '@/types/store';
import { StoreLogo } from './StoreLogo';
import { StoreInfo } from './StoreInfo';
import MobileStoreFollowing from './MobileStoreFollowing';

interface Props {
  store: Store;
  expandedHeight?: number;
  isFollowing?: boolean;
  onFollow?: () => void;
}

export default function MobileStoreProductsTagsHeader({
  store,
  expandedHeight = 130,
  isFollowing,
  onFollow,
}: Props) {
  const [bgColor, setBgColor] = useState<string>('rgba(0,0,0,0.12)');
  const formatShort = (n?: number) => {
    if (n === undefined || n === null) return '0';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    return String(n);
  };

  useEffect(() => {
    const preferredStoreImage = (store as any)?.banner || (store as any)?.coverImage || store?.products?.[0]?.image || store?.logo;
    if (!preferredStoreImage || typeof window === 'undefined') return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = encodeURI(preferredStoreImage);
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = 50;
        const h = 50;
        canvas.width = w;
        canvas.height = h;
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i+1];
          b += data[i+2];
          count++;
        }
        if (count === 0) return;
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        setBgColor(`rgb(${r}, ${g}, ${b})`);
      } catch {
        // ignore
      }
    };
  }, [store]);

  const handleBack = () => {
    if (typeof window !== 'undefined') window.history.back();
  };

  const handleSearch = () => {
    // noop for now
  };

  return (
    <div
      className="relative w-full"
      style={{
        height: `${expandedHeight}px`,
        background: `linear-gradient(180deg, ${bgColor} 0%, rgba(255,255,255,1) 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/15" />
      <div className="relative z-10 h-full flex flex-col px-4 pb-0">
        <div className="flex items-center justify-between mb-2.5 pt-2">
          <button onClick={handleBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 mx-3" />
          <div className="flex items-center gap-2">
            <button onClick={handleSearch} aria-label="Search store" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors mr-2">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
              <Share className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <StoreLogo store={store} />
          <div className="flex-1 pt-1">
            <StoreInfo store={store} />

            {/* Stats row with follow/chat buttons placed below StoreInfo */}
            <div className="mt-2 w-full">
              <div className="flex items-center justify-between pt-2.5 pb-2.5">
                <div className="w-[111px] flex items-center justify-start gap-2">
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold text-white">{formatShort(store.followers)}</div>
                    <div className="text-xs text-white/80">Followers</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold text-white">{formatShort(store.productCount)}</div>
                    <div className="text-xs text-white/80">Products</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold text-white">{String(store.rating ?? '-')}</div>
                    <div className="text-xs text-white/80">Rating</div>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <MobileStoreFollowing isFollowing={isFollowing} onToggle={onFollow} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

