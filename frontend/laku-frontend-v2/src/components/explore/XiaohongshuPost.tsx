'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import Link from 'next/link';

interface XiaohongshuPostProps {
  post: {
    id: string;
    image: string;
    title: string;
    author: {
      username: string;
      avatar: string;
    };
    likes: number;
    isLiked?: boolean;
  };
}

export function XiaohongshuPost({ post }: XiaohongshuPostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <Link href={`/post/${post.id}`} className="block w-full">
      <div className="relative bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow w-full">
        <div className="relative w-full bg-gray-100" style={{ paddingBottom: '133.33%' }}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover absolute inset-0"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>

        <div className="px-3 pt-2 pb-1 pr-4">
          <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight mb-2">
            {post.title}
          </p>

          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <div className="relative w-4 h-4 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {/* Always use gradient avatar placeholder - no external image loading */}
                <div className="w-full h-full bg-gradient-to-br from-[#FF2442] to-[#FF6B35] flex items-center justify-center">
                  <span className="text-[8px] text-white font-medium">
                    {post.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-600 truncate">
                {post.author.username}
              </span>
            </div>

            <button
              onClick={handleLike}
              className="flex items-center gap-0.5 flex-shrink-0 -ml-0.5"
            >
              <Heart
                className={`w-3 h-3 ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
              <span className="text-xs text-gray-600">
                {likes}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default XiaohongshuPost;
