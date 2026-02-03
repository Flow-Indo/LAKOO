'use client';

import { useState, useRef } from 'react';
import { Heart, Star, MessageCircle } from 'lucide-react';
import CommentModal from './CommentModal';

interface BottomActionsProps {
  postId: string;
  initialData: {
    likes: number;
    favorites: number;
    comments: number;
  };
  onCommentAdded?: () => void;
}

export default function BottomActions({
  postId,
  initialData,
  onCommentAdded
}: BottomActionsProps) {
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [counts, setCounts] = useState(initialData);

  const handleLike = () => {
    setLiked(!liked);
    setCounts(prev => ({
      ...prev,
      likes: liked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleFavorite = () => {
    setFavorited(!favorited);
    setCounts(prev => ({
      ...prev,
      favorites: favorited ? prev.favorites - 1 : prev.favorites + 1
    }));
  };

  const handleCommentAdded = () => {
    setCounts(prev => ({
      ...prev,
      comments: prev.comments + 1
    }));
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <>
      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 pb-safe">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          {/* Left: Comment Input Button */}
          <button
            onClick={() => setShowCommentModal(true)}
            className="flex items-center gap-2 px-4 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-gray-500" />
            <span className="text-[14px] text-gray-500">Tulis komentar...</span>
          </button>

          {/* Right: Action Icons with Counts */}
          <div className="flex items-center gap-3">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 min-w-[44px] group"
            >
              <Heart
                className={`w-6 h-6 transition-all ${
                  liked ? 'fill-red-500 text-red-500' : 'text-gray-700 group-hover:text-gray-900'
                }`}
                strokeWidth={1.5}
              />
              <span className={`text-[12px] font-medium ${
                liked ? 'text-red-500' : 'text-gray-700'
              }`}>
                {formatCount(counts.likes)}
              </span>
            </button>

            {/* Favorite */}
            <button
              onClick={handleFavorite}
              className="flex items-center gap-1.5 min-w-[44px] group"
            >
              <Star
                className={`w-6 h-6 transition-all ${
                  favorited ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700 group-hover:text-gray-900'
                }`}
                strokeWidth={1.5}
              />
              <span className={`text-[12px] font-medium ${
                favorited ? 'text-yellow-500' : 'text-gray-700'
              }`}>
                {formatCount(counts.favorites)}
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={() => setShowCommentModal(true)}
              className="flex items-center gap-1.5 min-w-[44px] group"
            >
              <MessageCircle
                className="w-6 h-6 text-gray-700 group-hover:text-gray-900"
                strokeWidth={1.5}
              />
              <span className="text-[12px] font-medium text-gray-700 group-hover:text-gray-900">
                {formatCount(counts.comments)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        postId={postId}
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
}
