'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import Link from 'next/link';

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

// Generate mock posts for recommendations
const generateMockPosts = (startIndex: number, count: number): Post[] => {
  const imageIds = [
    1515886657613, 1441986300917, 1504674900247, 1476514525535,
    1571019614242, 1523275335684, 1542291026, 1560343090,
    1551028719, 1594938298603, 1617123164444, 1620799140408,
    1596755094514, 1595777457583, 1549298916, 1473966968600,
    1515886657614, 1441986300918, 1504674900248, 1476514525536,
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `rec-${startIndex + i}`,
    image: `https://images.unsplash.com/photo-${imageIds[(startIndex + i) % imageIds.length]}?w=400&h=533&fit=crop`,
    title: `Recommendation post ${startIndex + i + 1} - Check out this amazing content!`,
    author: {
      username: `user_${startIndex + i}`,
      avatar: `https://i.pravatar.cc/150?img=${(startIndex + i) % 70}`,
    },
    likes: Math.floor(Math.random() * 5000) + 100,
    isLiked: false,
  }));
};

function RecommendationPost({ post }: { post: Post }) {
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

export default function RelatedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch initial posts
  useEffect(() => {
    const initialPosts = generateMockPosts(0, 10);
    setPosts(initialPosts);
    setOffset(10);
    setIsLoading(false);
  }, []);

  // Load more posts when scrolling
  const loadMorePosts = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newPosts = generateMockPosts(offset, 10);
      setPosts(prev => [...prev, ...newPosts]);
      setOffset(prev => prev + 10);
      setIsLoading(false);
    }, 500);
  }, [offset, isLoading]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMorePosts, isLoading]);

  return (
    <div className="px-1 py-1.5">
      <div 
        className="grid grid-cols-2 gap-1.5"
        style={{
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {posts.map((post) => (
          <RecommendationPost key={post.id} post={post} />
        ))}
      </div>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {isLoading && (
          <div className="flex gap-1 items-center">
            <div 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '100ms' }}
            />
            <div 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '200ms' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
