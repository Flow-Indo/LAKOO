'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import CommentItem from './CommentItem';
import { ChevronDown } from 'lucide-react';

type SortOption = 'latest' | 'popular' | 'oldest';

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

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  totalComments: number;
}

const sortLabels: Record<SortOption, string> = {
  latest: 'Terbaru',
  popular: 'Terpopuler',
  oldest: 'Terlama'
};

// Generate mock comments quickly
const generateMockComments = (page: number): Comment[] => {
  const names = ['Fitnes Trainer', 'Healthy Cook', 'Gym Addict', 'Nutrition Expert', 'Workout Buddy', 'Diet Plan', 'Fitness Life', 'Health Seeker', 'Gym Warrior', 'Wellness Coach'];
  const locations = ['Bali', 'Yogyakarta', 'Bandung', 'Surabaya', 'Jakarta', 'Medan', 'Makassar', 'Semarang'];
  const contents = [
    'Great workout routine! Been doing this for 2 weeks and already seeing results.',
    ' resepnya bisa share ga? Mau coba buat keluarga.',
    'Berapa kali seminggu olahraga untuk hasil maksimal?',
    'Tips buat pemula yang baru mulai gym?',
    'Berapa lama istirahat antar set yang bagus?',
    'Makanan apa saja yang harus dihindari saat cutting?',
    'Suplemen yang wajib dikonsumsi untuk otot?',
    'Cara tidur yang cukup penting untuk recovery.',
    'Berapa liter air yang harus diminum per hari?',
    'Kapan waktu yang tepat untuk cardio?'
  ];
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: `mock_${page}_${i}_${Date.now()}`,
    author: {
      name: names[(page * 5 + i) % names.length],
      avatar: `https://i.pravatar.cc/150?img=${(page * 5 + i + 30) % 70}`,
      isAuthor: false
    },
    content: contents[(page * 5 + i) % contents.length],
    timestamp: `${(page + 1) * 2 + i} jam yang lalu`,
    location: locations[(page * 5 + i) % locations.length],
    likes: Math.floor(Math.random() * 100) + 10,
    replies: []
  }));
};

export default function CommentSection({ 
  postId, 
  comments: initialComments, 
  totalComments: initialTotal 
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalComments] = useState(initialTotal);
  const observerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Fast infinite scroll with IntersectionObserver
  const loadMoreComments = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    setLoading(true);

    // Faster loading with setTimeout
    setTimeout(() => {
      const newComments = generateMockComments(page);
      setComments(prev => [...prev, ...newComments]);
      setPage(prev => prev + 1);
      
      // Stop after 5 pages for demo
      if (page >= 5) {
        setHasMore(false);
      }
      
      loadingRef.current = false;
      setLoading(false);
    }, 300); // Fast 300ms delay
  }, [page, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loadingRef.current && hasMore) {
          loadMoreComments();
        }
      },
      {
        rootMargin: '200px', // Preload 200px before reaching bottom
        threshold: 0
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreComments, hasMore]);

  // Handle sort change (instant local sort)
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setShowSortMenu(false);
    
    // Instant sort on current comments
    const sorted = [...comments];
    if (newSort === 'popular') {
      sorted.sort((a, b) => b.likes - a.likes);
    } else if (newSort === 'oldest') {
      sorted.sort((a, b) => {
        const timeA = parseInt(a.timestamp) || 0;
        const timeB = parseInt(b.timestamp) || 0;
        return timeB - timeA;
      });
    }
    setComments(sorted);
  };

  return (
    <div className="bg-white border-t-[6px] border-gray-100">
      {/* Header with Sort */}
      <div className="sticky top-[56px] z-30 bg-white px-4 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-gray-900">
            {totalComments} komentar
          </h2>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-gray-900 font-medium"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
              {sortLabels[sortBy]}
            </button>
            
            {showSortMenu && (
              <>
                {/* Backdrop - Left aligned */}
                <div
                  className="fixed left-0 right-0 top-0 bottom-0 z-40"
                  onClick={() => setShowSortMenu(false)}
                />

                {/* Menu - Aligned with button */}
                <div className="absolute right-0 w-28 bg-white rounded-lg shadow-lg border border-gray-200 py-0.5 z-50 mt-1">
                  <button
                    onClick={() => handleSortChange('latest')}
                    className={`w-full px-2.5 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors ${
                      sortBy === 'latest' ? 'text-[#ff2742] font-medium' : 'text-gray-700'
                    }`}
                  >
                    Terbaru
                  </button>
                  <button
                    onClick={() => handleSortChange('popular')}
                    className={`w-full px-2.5 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors ${
                      sortBy === 'popular' ? 'text-[#ff2742] font-medium' : 'text-gray-700'
                    }`}
                  >
                    Terpopuler
                  </button>
                  <button
                    onClick={() => handleSortChange('oldest')}
                    className={`w-full px-2.5 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors ${
                      sortBy === 'oldest' ? 'text-[#ff2742] font-medium' : 'text-gray-700'
                    }`}
                  >
                    Terlama
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="px-4 py-4">
        <div className="space-y-0">
          {comments.map((comment, index) => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              isLast={index === comments.length - 1}
            />
          ))}
        </div>

        {/* Loading State - Compact */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#ff2742] rounded-full animate-spin" />
              <span className="text-[13px]">Memuat...</span>
            </div>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        {hasMore && (
          <div ref={observerRef} className="h-4" />
        )}

        {/* End Indicator */}
        {!hasMore && comments.length > 0 && (
          <div className="flex items-center justify-center py-6">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="h-px w-12 bg-gray-200" />
              <span className="text-[13px] font-medium">Akhir</span>
              <div className="h-px w-12 bg-gray-200" />
            </div>
          </div>
        )}

        {/* Empty State */}
        {comments.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-3">💬</div>
            <p className="text-[14px] text-gray-500">Belum ada komentar</p>
            <p className="text-[13px] text-gray-400 mt-1">Jadilah yang pertama berkomentar!</p>
          </div>
        )}
      </div>
    </div>
  );
}
