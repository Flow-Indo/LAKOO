'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface PostHeaderProps {
  author: {
    id?: string;
    name: string;
    avatar: string;
    followerCount: number;
    isFollowing?: boolean;
  };
}

const formatFollowerCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)} juta`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}rb`;
  }
  return count.toString();
};

export default function PostHeader({ author }: PostHeaderProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(author.isFollowing ?? false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: author.name,
        text: 'Lihat profil ini',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan disalin!');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-14">
      <div className="flex items-center justify-between px-3 h-full">
        {/* Left: Back button */}
        <button 
          onClick={() => router.back()}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Center: Avatar + info */}
        <div className="flex items-center gap-2 flex-1 mx-2">
          <Image
            src={author.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(author.name)}`}
            alt={author.name}
            width={32}
            height={32}
            className="rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-xs font-medium text-gray-900 truncate">{author.name}</h2>
            <p className="text-[10px] text-gray-500">{formatFollowerCount(author.followerCount)} pengikut</p>
          </div>
        </div>

        {/* Right: Follow + More button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-3 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
              isFollowing 
                ? 'bg-white text-gray-700 border border-gray-300' 
                : 'bg-white text-[#ff2742] border border-[#ff2742]'
            }`}
          >
            {isFollowing ? 'Mengikuti' : 'Ikuti'}
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
