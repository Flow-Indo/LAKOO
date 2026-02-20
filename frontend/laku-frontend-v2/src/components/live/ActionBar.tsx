'use client';

import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LiveVideo } from '@/types/live';

interface Props {
  video: LiveVideo;
  onVideoUpdate: (video: LiveVideo) => void;
  onCommentClick: () => void;
}

export function ActionBar({ video, onVideoUpdate, onCommentClick }: Props) {
  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleLike = () => {
    onVideoUpdate({
      ...video,
      isLiked: !video.isLiked,
      likes: video.isLiked ? video.likes - 1 : video.likes + 1,
    });
  };

  const handleSave = () => {
    onVideoUpdate({
      ...video,
      isSaved: !video.isSaved,
      saves: video.isSaved ? video.saves - 1 : video.saves + 1,
    });
  };

  return (
    <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">

      {/* Like Button */}
      <button
        onClick={handleLike}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition">
          <Heart
            className={cn(
              "w-7 h-7",
              video.isLiked ? "fill-red-500 text-red-500" : "text-white"
            )}
          />
        </div>
        <span className="text-xs font-semibold text-white">
          {formatCount(video.likes)}
        </span>
      </button>

      {/* Comment Button */}
      <button
        onClick={onCommentClick}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        <span className="text-xs font-semibold text-white">
          {formatCount(video.comments)}
        </span>
      </button>

      {/* Share Button */}
      <button className="flex flex-col items-center gap-1 group">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition">
          <Share2 className="w-7 h-7 text-white" />
        </div>
        <span className="text-xs font-semibold text-white">
          {formatCount(video.shares)}
        </span>
      </button>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition">
          <Bookmark
            className={cn(
              "w-7 h-7",
              video.isSaved ? "fill-white text-white" : "text-white"
            )}
          />
        </div>
      </button>

      {/* More Options */}
      <button className="flex flex-col items-center gap-1 group">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition">
          <MoreHorizontal className="w-7 h-7 text-white" />
        </div>
      </button>

    </div>
  );
}