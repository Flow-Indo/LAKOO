'use client';

import { Heart, MessageCircle, Share2, MoreVertical, Plus } from 'lucide-react';
import type { LiveShop } from '@/types/live-shopping';
import { cn } from '@/lib/utils';

interface Props {
  shop: LiveShop;
  likes: number;
  comments: number;
  isLiked: boolean;
  onFollow: () => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onMore: () => void;
}

export function LiveActionBar({ shop, likes, comments, isLiked, onFollow, onLike, onComment, onShare, onMore }: Props) {
  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="md:relative md:flex md:flex-col md:items-center md:gap-6 md:z-10 absolute right-4 bottom-[calc(10vh+140px)] flex flex-col items-center gap-5 z-10 md:right-0 md:bottom-0">

      {/* Shop Avatar with Follow Button */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="relative">
          <img
            src={shop.logo}
            alt={shop.name}
            className="w-12 h-12 rounded-full"
          />
          {!shop.isFollowing && (
            <button
              onClick={onFollow}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white hover:scale-110 transition"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Like */}
      <button
        onClick={onLike}
        className="flex flex-col items-center gap-1"
      >
        <Heart
          className={cn(
            "w-8 h-8 md:w-10 md:h-10 hover:scale-110 transition",
            isLiked ? "fill-red-500 text-red-500" : "text-white md:text-gray-900"
          )}
          style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }}
        />
        <span className="text-xs font-semibold text-white md:text-gray-900" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }}>
          {formatCount(likes)}
        </span>
      </button>

      {/* Comment */}
      <button
        onClick={onComment}
        className="flex flex-col items-center gap-1"
      >
        <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-white md:text-gray-900 hover:scale-110 transition" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
        <span className="text-xs font-semibold text-white md:text-gray-900" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }}>
          {formatCount(comments)}
        </span>
      </button>

      {/* Share */}
      <button
        onClick={onShare}
        className="flex flex-col items-center gap-1"
      >
        <Share2 className="w-8 h-8 md:w-10 md:h-10 text-white md:text-gray-900 hover:scale-110 transition" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
        <span className="text-xs font-semibold text-white md:text-gray-900" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }}>Share</span>
      </button>

      {/* More */}
      <button
        onClick={onMore}
        className="flex flex-col items-center gap-1"
      >
        <MoreVertical className="w-8 h-8 md:w-10 md:h-10 text-white md:text-gray-900 hover:scale-110 transition" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
      </button>

    </div>
  );
}