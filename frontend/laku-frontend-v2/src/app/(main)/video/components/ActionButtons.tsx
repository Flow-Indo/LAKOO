 'use client';
 
 import React, { useState } from 'react';
 import { Heart, MessageCircle, Gift, Share2 } from 'lucide-react';

type Props = {
  likes: number;
  onLike?: () => void;
  onComment?: () => void;
  onGift?: () => void;
  onShare?: () => void;
};

 export function ActionButtons({ likes, onLike, onComment, onGift, onShare }: Props) {
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleLike = () => {
    setLiked(true);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 700);
    if (onLike) onLike();
  };

  return (
    <div className="absolute right-4 bottom-24 top-28 z-50 flex flex-col items-center gap-4">
      <div className="relative">
        {animate && <span className="absolute -inset-1 rounded-full bg-red-500/40 animate-ping" />}
        <button
          onClick={handleLike}
          className="relative flex flex-col items-center text-xs bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30 drop-shadow-lg"
          aria-label="like"
        >
          <Heart className={`w-6 h-6 drop-shadow ${liked ? 'text-red-500' : 'text-white'}`} />
          <span className="mt-1 text-[11px] text-white drop-shadow">{likes}</span>
        </button>
      </div>

      <button
        onClick={onComment}
        className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30 drop-shadow-lg"
        aria-label="comment"
      >
        <MessageCircle className="w-6 h-6 text-white drop-shadow" />
      </button>

      <button
        onClick={onGift}
        className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30 drop-shadow-lg"
        aria-label="gift"
      >
        <Gift className="w-6 h-6 text-white drop-shadow" />
      </button>

      <button
        onClick={onShare}
        className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30 drop-shadow-lg"
        aria-label="share"
      >
        <Share2 className="w-6 h-6 text-white drop-shadow" />
      </button>
    </div>
  );
 }

