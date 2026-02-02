'use client';

import React from 'react';
import { Store } from '@/types/store';

interface ActionButtonsProps {
  store: Store;
  onFollow: () => void;
  onChat: () => void;
}

export function ActionButtons({ store, onFollow, onChat }: ActionButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-1 mt-5 mb-5">
      {/* Follow button intentionally removed */}
    </div>
  );
}

