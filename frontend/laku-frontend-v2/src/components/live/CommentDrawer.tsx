'use client';

import { X, Send } from 'lucide-react';
import { useState } from 'react';

interface Props {
  videoId: string;
  commentCount: number;
  onClose: () => void;
}

export function CommentDrawer({ videoId, commentCount, onClose }: Props) {
  const [comment, setComment] = useState('');

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black/95">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-white font-semibold">
          Comments ({commentCount.toLocaleString()})
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-center text-white/50 py-8">
          No comments yet. Be the first to comment!
        </p>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button
          disabled={!comment.trim()}
          className="p-3 rounded-full bg-red-500 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}