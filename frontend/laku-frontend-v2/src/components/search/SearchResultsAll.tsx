'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { XiaohongshuPost } from '@/components/explore/XiaohongshuPost';

interface SearchResultsAllProps {
  query: string;
}

// Define post type for XiaohongshuPost
interface Post {
  id: string;
  image: string;
  title: string;
  author: {
    username: string;
    avatar: string;
  };
  likes: number;
  isLiked?: boolean;
}

export default function SearchResultsAll({ query }: SearchResultsAllProps) {
  const [sortBy, setSortBy] = useState('top');

  // Suggested searches with icons
  const suggestedSearches = [
    { icon: '🌸', hashtag: '#ootd', title: 'OOTD Sepanjang hari yang nyaman', subtitle: 'Fashion style' },
    { icon: '💄', hashtag: '#makeup', title: 'Casual look dengan vibe chill', subtitle: 'Beauty tips' }
  ];

  // Mock posts - transform to match XiaohongshuPost format
  const posts: Post[] = [
    {
      id: '1',
      slug: 'cult-suri',
      image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor1.webp',
      title: '⋆｡🌸☆｡#氛围感 #live图 #来拍照了',
      author: { username: 'Fashion Diary', avatar: '' },
      likes: 10000
    },
    {
      id: '2',
      slug: 'karakiri',
      image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor1.webp',
      title: 'OOTD Sepanjang hari yang nyaman dan stylish',
      author: { username: 'Style Guru', avatar: '' },
      likes: 8500
    },
    {
      id: '3',
      slug: 'rue',
      image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor1.webp',
      title: 'Casual look dengan vibe yang chill',
      author: { username: 'Casual Queen', avatar: '' },
      likes: 7200
    },
    {
      id: '4',
      slug: 'wearthreek',
      image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_eksplor1.webp',
      title: 'Hangat dan cozy untuk musim hujan',
      author: { username: 'Cozy Style', avatar: '' },
      likes: 6500
    },
    {
      id: '5',
      slug: 'cult-suri-2',
      image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor2.webp',
      title: 'Party look yang elegan dan memukau',
      author: { username: 'Glam Guide', avatar: '' },
      likes: 9800
    },
    {
      id: '6',
      slug: 'karakiri-2',
      image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor2.webp',
      title: 'Denim yang never goes out of style',
      author: { username: 'Denim Lover', avatar: '' },
      likes: 5400
    }
  ];

  const filters = ['Top', 'Terbaru', 'Fashion', 'Beauty', 'Lifestyle'];

  return (
    <div className="bg-white min-h-screen">
      {/* Filter Pills - MOBILE OPTIMIZED */}
      <div className="sticky top-[109px] z-30 bg-white px-3 py-3 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSortBy(filter.toLowerCase())}
              className={`flex-shrink-0 h-9 px-4 rounded-full text-[14px] font-medium transition-colors whitespace-nowrap ${
                sortBy === filter.toLowerCase()
                  ? 'bg-gray-900 text-white'
                  : 'bg-[#F7F8FA] text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Searches - MOBILE OPTIMIZED */}
      <div className="px-3 py-4">
        
        {/* Posts Grid - Using XiaohongshuPost Component */}
        <div className="grid grid-cols-2 gap-1.5">
          {posts.map((post) => (
            <XiaohongshuPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
