'use client';

import { useState } from 'react';
import { Heart, Star, MessageCircle, X } from 'lucide-react';

interface BottomActionsProps {
  postId: string;
  initialData: {
    likes: number;
    favorites: number;
    comments: number;
  };
}

const formatNumber = (n: number): string => {
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return n.toString();
};

export default function BottomActions({ postId, initialData }: BottomActionsProps) {
  const [likes, setLikes] = useState(initialData.likes);
  const [favorites, setFavorites] = useState(initialData.favorites);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleFavorite = () => {
    setFavorited(!favorited);
    setFavorites(favorited ? favorites - 1 : favorites + 1);
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      alert('Komentar terkirim!');
      setCommentText('');
      setShowCommentModal(false);
    }
  };

  return (
    <>
      {/* Bottom Bar - Optimized for iPhone */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex items-center gap-2 px-3 py-2.5 max-w-md mx-auto">
          {/* Comment Input - Tighter on mobile */}
          <button
            onClick={() => setShowCommentModal(true)}
            className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-150 rounded-full transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Bagikan...</span>
          </button>
          
          {/* Actions - Compact on mobile */}
          <div className="flex items-center gap-3">
            <button onClick={handleLike} className="flex flex-col items-center gap-0">
              <Heart
                className={`w-5 h-5 transition-all ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-700'}`}
              />
              <span className={`text-[10px] ${liked ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                {formatNumber(likes)}
              </span>
            </button>
            
            <button onClick={handleFavorite} className="flex flex-col items-center gap-0">
              <Star
                className={`w-5 h-5 transition-all ${favorited ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-700'}`}
              />
              <span className={`text-[10px] ${favorited ? 'text-yellow-600 font-medium' : 'text-gray-600'}`}>
                {formatNumber(favorites)}
              </span>
            </button>
            
            <button onClick={() => setShowCommentModal(true)} className="flex flex-col items-center gap-0">
              <MessageCircle className="w-5 h-5 text-gray-700" />
              <span className="text-[10px] text-gray-600">{formatNumber(initialData.comments)}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Comment Modal - Full screen on mobile */}
      {showCommentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center md:justify-center">
          <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold">Tulis Komentar</h3>
              <button onClick={() => setShowCommentModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <textarea
              placeholder="Bagikan pendapat Anda..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full h-32 p-4 text-sm resize-none focus:outline-none"
              autoFocus
            />
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="flex gap-2">
                <button className="text-lg">📷</button>
                <button className="text-lg">😊</button>
              </div>
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                  commentText.trim() ? 'bg-[#ff2742] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
