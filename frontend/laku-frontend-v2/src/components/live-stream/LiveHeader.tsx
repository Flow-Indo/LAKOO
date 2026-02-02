'use client';

import { X, Heart, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { LiveStream } from '@/types/live-stream';

interface Props {
  stream: LiveStream;
  onLike: () => void;
}

export function LiveHeader({ stream, onLike }: Props) {
  const router = useRouter();

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent h-20" />

      {/* Content */}
      <div className="relative flex items-center justify-between px-4 py-3 pt-safe-top">
        {/* Left side - Seller info */}
        <div className="flex items-center gap-3">
          {/* Seller avatar with live indicator */}
          <div className="relative">
            <img
              src={stream.seller.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(stream.seller.username)}`}
              alt={stream.seller.name}
              className="w-10 h-10 rounded-full border-2 border-pink-500 animate-pulse"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs px-1 rounded font-semibold">
              LIVE
            </div>
          </div>

          {/* Seller name and likes */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-white font-semibold text-sm drop-shadow-lg">
                {stream.seller.username}
              </span>
              {stream.seller.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-white">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-white drop-shadow-lg" />
              <span className="text-white text-xs drop-shadow-lg">
                {formatCount(stream.likeCount)}
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Viewers and close */}
        <div className="flex items-center gap-3">
          {/* Viewer avatars */}
          <div className="flex items-center gap-1">
            <div className="flex -space-x-2">
              {stream.viewers.slice(0, 3).map((viewer, index) => (
                <img
                  key={viewer.id}
                  src={viewer.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(viewer.username)}`}
                  alt={viewer.username}
                  className="w-6 h-6 rounded-full border border-white"
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-white text-xs drop-shadow-lg">
              <Users className="w-3 h-3" />
              <span>{formatCount(stream.viewerCount)}</span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => router.back()}
            className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}