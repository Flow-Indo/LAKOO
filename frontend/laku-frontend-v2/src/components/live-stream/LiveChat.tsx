'use client';

import { useEffect, useRef, useState } from 'react';
import type { LiveComment } from '@/types/live-stream';

interface Props {
  comments: LiveComment[];
  onCommentClick?: () => void;
}

export function LiveChat({ comments, onCommentClick }: Props) {
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div
      ref={chatRef}
      onClick={onCommentClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 w-40 max-h-80 overflow-y-auto z-40 space-y-2 scrollbar-hide"
    >
      {comments.slice(-5).map((comment) => (
        <div
          key={comment.id}
          className={`flex items-start gap-2 p-2 rounded-lg transition-all duration-300 ${
            comment.type === 'join'
              ? 'bg-yellow-500/20 border border-yellow-500/30'
              : comment.type === 'gift' || comment.type === 'rose'
              ? 'bg-pink-500/20 border border-pink-500/30'
              : 'bg-black/40 backdrop-blur-sm'
          }`}
        >
          <img
            src={comment.user.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(comment.user.username)}`}
            alt={comment.user.username}
            className="w-6 h-6 rounded-full border border-white/50 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-white text-xs font-medium truncate">
                {comment.user.username}
              </span>
              {comment.user.isVerified && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </div>
            <p className="text-white text-xs leading-tight break-words">
              {comment.type === 'join' && 'joined the live stream'}
              {comment.type === 'gift' && `sent ${comment.giftValue} coins gift`}
              {comment.type === 'rose' && `sent ${comment.giftValue} coins rose`}
              {comment.type === 'comment' && comment.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}