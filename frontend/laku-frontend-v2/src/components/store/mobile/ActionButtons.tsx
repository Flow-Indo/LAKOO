 'use client';

import React from 'react';
import { Store } from '@/types/store';
import { Plus } from 'lucide-react';

interface ActionButtonsProps {
  store: Store;
  onFollow: () => void;
  onChat: () => void;
}

export function ActionButtons({ store, onFollow, onChat }: ActionButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-1 mt-5 mb-5">
      <button
        onClick={onFollow}
        className={`flex items-center justify-center gap-1 rounded-md transition-colors text-xs ${
          store.isFollowing
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent'
            : 'bg-gradient-to-r from-orange-400 to-red-500 text-white border-transparent'
        }`}
        aria-label={store.isFollowing ? 'Following' : '+ Ikuti'}
        // responsive width:height ratio using CSS variable so we can compute height exactly,
        // and override global min-height via inline minHeight.
        // --btn-w is responsive (clamped), width uses it, height is half the width.
        style={{
          // responsive width variable: ~11.63vw gives ~50px on 430px viewport
          // keeps a min/max so it scales across devices
          ['--btn-w' as any]: 'clamp(60px, 11.63vw, 88px)',
          width: 'var(--btn-w)',
          height: 'calc(var(--btn-w) / 2)',
          minHeight: '0px', // override global min-height:44px set in globals.css
          boxSizing: 'border-box',
          padding: '0 8px',
          marginTop: '10px',
          marginBottom: '10px',
        } as React.CSSProperties}
      >

        <span className="text-xs font-semibold">{store.isFollowing ? 'Mengikuti' : '+ Ikuti'}</span>
      </button>

      {/* Chat button removed */}
    </div>
  );
}

