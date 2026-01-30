'use client';

import Image from 'next/image';
import { Store } from '@/types/store';
import { PerformanceBadges } from './PerformanceBadges';
import { StoreLogo } from './StoreLogo';
import { StoreInfo } from './StoreInfo';
import { StoreStats } from './StoreStats';
import { ActionButtons } from './ActionButtons';


interface MobileStoreInfoCardProps {
  store: Store;
}

export function MobileStoreInfoCard({ store }: MobileStoreInfoCardProps) {
  const handleFollow = () => {
    // TODO: Implement follow/unfollow logic
    console.log('Toggle follow store');
  };

  const handleChat = () => {
    // TODO: Implement chat functionality
    console.log('Open chat with store');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share store');
  };

  return (
    <div className="px-4 pb-[1px]">
      {/* Store Identity */}
      <div className="flex items-start gap-4 mb-4">
        <StoreLogo store={store} />

        <div className="flex-1 pt-1">
          <StoreInfo store={store} />
          <StoreStats store={store} />
        </div>

        <div className="flex-shrink-0 mt-4">
          <ActionButtons store={store} onFollow={handleFollow} onChat={handleChat} />
        </div>
        
      </div>
      <PerformanceBadges badges={store.badges} />
    </div>
  );
}