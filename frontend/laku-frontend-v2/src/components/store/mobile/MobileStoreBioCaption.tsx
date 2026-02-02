 'use client';

import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Store } from '@/types/store';
import { getStoreBySlug } from '@/lib/stores-data';
import { useState } from 'react';
import MobileStoreFollowing from './MobileStoreFollowing';

interface MobileStoreBioCaptionProps {
  store: Store;
  onFollow?: () => void;
  onChat?: () => void;
  isFollowing?: boolean;
}

export function MobileStoreBioCaption({ store, onFollow, onChat, isFollowing }: MobileStoreBioCaptionProps) {
  const router = useRouter();
  const handleChat = () => {
    if (onChat) return onChat();
    // Navigate to messages page
    router.push('/messages');
  };

  // fallback local follow state when control prop not provided
  const [localFollowing, setLocalFollowing] = useState<boolean>(!!store.isFollowing);

  const following = typeof isFollowing === 'boolean' ? isFollowing : localFollowing;

  const handleFollow = () => {
    if (typeof isFollowing === 'boolean') {
      if (onFollow) onFollow();
    } else {
      const next = !localFollowing;
      setLocalFollowing(next);
      if (onFollow) onFollow();
    }
  };

  const slugFromId =
    store.id && store.id.startsWith('store-') ? store.id.replace(/^store-/, '') : undefined;

  const brandData = slugFromId ? getStoreBySlug(slugFromId) : undefined;
  const caption = brandData?.story?.about || store.description || '';

  const formatShort = (n?: number) => {
    if (n === undefined || n === null) return '0';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    return String(n);
  };

  if (!caption) return null;

  return (
    <div className="mt-[12px]">
      <div className="mt-[20px] w-[230px] text-[12px] text-white leading-snug pt-2.5 pb-2.5">
        {caption}
      </div>

      {/* Stats row with follow/chat buttons to the right */}
      <div className="mt-[20px] w-full">
        <div className="flex items-center justify-between pt-2.5 pb-2.5 mb-2.5">
          {/* Stats */}
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
              <div className="text-sm font-semibold text-white">{store.rating}</div>
              <div className="text-xs text-white/80">Rating</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="ml-4 flex items-center gap-2">
            <MobileStoreFollowing isFollowing={following} onToggle={handleFollow} />

            <button
              onClick={handleChat}
              className="w-10 h-[27px] rounded-full border border-white/40 flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
