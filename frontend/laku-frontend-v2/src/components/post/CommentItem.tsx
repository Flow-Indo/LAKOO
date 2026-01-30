'use client';

import { useState } from 'react';
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

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className={`${!isLast ? 'pb-5' : ''}`}>
      {/* Main Comment */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={comment.author.avatar || '/default-avatar.png'}
            alt={comment.author.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
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

          {/* View Replies Button */}
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 text-[13px] text-[#0066FF] hover:text-[#0052CC] font-medium mt-2 mb-3"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{showReplies ? 'Sembunyikan' : 'Lihat'} {comment.replies.length} balasan</span>
              {showReplies ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Replies */}
          {showReplies && comment.replies && (
            <div className="space-y-4 mt-3 pl-0">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2.5">
                  <Image
                    src={reply.author.avatar || '/default-avatar.png'}
                    alt={reply.author.name}
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-medium text-gray-900">
                        {reply.author.name}
                      </span>
                      {reply.author.isAuthor && (
                        <span className="px-1.5 py-0.5 bg-[#ff2742] text-white text-[9px] rounded font-medium">
                          Penulis
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-gray-700 leading-relaxed mb-1.5 break-words">
                      {reply.content}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-gray-500">{reply.timestamp}</span>
                      <span className="text-[11px] text-gray-500">{reply.location}</span>
                      <button className="text-[11px] text-gray-500 hover:text-gray-700 font-medium">
                        Balas
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                    {reply.likes > 0 && (
                      <span className="text-[10px] text-gray-500">{reply.likes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
          <button onClick={handleLike} className="group">
            <Heart
              className={`w-5 h-5 transition-all ${
                liked
                  ? 'fill-red-500 text-red-500 scale-110'
                  : 'text-gray-400 group-hover:text-red-500 group-hover:scale-110'
              }`}
            />
          </button>
          {likeCount > 0 && (
            <span className={`text-[11px] font-medium ${liked ? 'text-red-500' : 'text-gray-500'}`}>
              {likeCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
