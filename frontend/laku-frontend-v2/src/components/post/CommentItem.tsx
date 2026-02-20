'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Reply {
  id: string;
  author: {
    name: string;
    avatar: string;
    isAuthor?: boolean;
  };
  content: string;
  timestamp: string;
  location: string;
  likes: number;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    isAuthor?: boolean;
  };
  content: string;
  timestamp: string;
  location: string;
  likes: number;
  replies?: Reply[];
}

interface CommentItemProps {
  comment: Comment;
  isLast?: boolean;
}

export default function CommentItem({ comment, isLast }: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [showReplies, setShowReplies] = useState(false);

  // Check if all replies are from the author
  const hasAuthorOnlyReplies = comment.replies && comment.replies.length > 0 &&
    comment.replies.every(reply => reply.author.isAuthor);

  // Auto-show replies if they're all from the author
  useEffect(() => {
    if (hasAuthorOnlyReplies) {
      setShowReplies(true);
    }
  }, [hasAuthorOnlyReplies]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  // Filter non-author replies for the dropdown
  const nonAuthorReplies = comment.replies?.filter(reply => !reply.author.isAuthor) || [];

  return (
    <div className={`${!isLast ? 'pb-5' : ''}`}>
      {/* Main Comment */}
      <div className="flex gap-3">
        {/* Avatar with gradient fallback */}
        <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-[#FF2442] to-[#FF6B35] flex items-center justify-center">
          <span className="text-[9px] text-white font-medium">
            {comment.author.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author Name + Badge */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] font-medium text-gray-900">
              {comment.author.name}
            </span>
            {comment.author.isAuthor && (
              <span className="px-2 py-0.5 bg-[#ff2742] text-white text-[10px] rounded font-medium leading-tight">
                Penulis
              </span>
            )}
          </div>

          {/* Comment Text */}
          <p className="text-[14px] text-gray-700 leading-relaxed mb-2 break-words">
            {comment.content}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[12px] text-gray-500">{comment.timestamp}</span>
            <span className="text-[12px] text-gray-500">{comment.location}</span>
            <button className="text-[12px] text-gray-500 hover:text-gray-700 font-medium transition-colors">
              Balas
            </button>
          </div>

          {/* View Replies Button - Only for non-author replies */}
          {nonAuthorReplies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 text-[13px] text-[#0066FF] hover:text-[#0052CC] font-medium mt-2 mb-3"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{showReplies ? 'Sembunyikan' : 'Lihat'} {nonAuthorReplies.length} balasan</span>
              {showReplies ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Replies - Author replies shown by default, non-author replies toggle */}
          {(showReplies || hasAuthorOnlyReplies) && comment.replies && (
            <div className="pt-4 space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  {/* Reply Avatar with gradient fallback */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-[#FF2442] to-[#FF6B35] flex items-center justify-center">
                    <span className="text-[9px] text-white font-medium">
                      {reply.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] font-medium text-gray-900">
                        {reply.author.name}
                      </span>
                      {reply.author.isAuthor && (
                        <span className="px-2 py-0.5 bg-[#ff2742] text-white text-[10px] rounded font-medium leading-tight">
                          Penulis
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] text-gray-700 leading-relaxed mb-2 break-words">
                      {reply.content}
                    </p>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[12px] text-gray-500">{reply.timestamp}</span>
                      <span className="text-[12px] text-gray-500">{reply.location}</span>
                      <button className="text-[12px] text-gray-500 hover:text-gray-700 font-medium transition-colors">
                        Balas
                      </button>
                    </div>
                  </div>
                  {/* Reply Like Button */}
                  <div className="pt-2 flex flex-col items-center gap-0.5 flex-shrink-0">
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                    {reply.likes > 0 && (
                      <span className={`text-[10px] font-medium ${liked ? 'text-red-500' : 'text-gray-500'}`}>
                        {reply.likes}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Like Button */}
        <div className="pt-2 flex flex-col items-center gap-0.5 flex-shrink-0">
          <button onClick={handleLike} className="group">
            <Heart
              className={`w-4 h-4 transition-all ${
                liked
                  ? 'fill-red-500 text-red-500 scale-110'
                  : 'text-gray-400 group-hover:text-red-500 group-hover:scale-110'
              }`}
            />
          </button>
          {likeCount > 0 && (
            <span className={`text-[10px] text-gray-500 font-medium ${liked ? 'text-red-500' : 'text-gray-500'}`}>
              {likeCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
