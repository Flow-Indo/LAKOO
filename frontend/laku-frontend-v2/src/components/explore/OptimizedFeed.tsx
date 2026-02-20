'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { XiaohongshuPost } from './XiaohongshuPost';
import { motion } from 'framer-motion';

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

interface OptimizedFeedProps {
  mode: string;
  initialPosts?: Post[];
}

export function OptimizedFeed({ mode, initialPosts = [] }: OptimizedFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialPosts.length);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Generate mock posts based on mode
  const generateMockPosts = useCallback((startIndex: number, count: number): Post[] => {
    return Array.from({ length: count }, (_, i) => {
      const imageIds = [
        1515886657613, 1441986300917, 1504674900247, 1476514525535,
        1571019614242, 1523275335684, 1542291026, 1560343090,
        1551028719, 1594938298603, 1617123164444, 1620799140408,
        1596755094514, 1595777457583, 1549298916, 1473966968600,
        1515886657614, 1441986300918, 1504674900248, 1476514525536,
      ];
      
      return {
        id: `${mode}-${startIndex + i}`,
        image: `https://images.unsplash.com/photo-${imageIds[(startIndex + i) % imageIds.length]}?w=400&h=533&fit=crop`,
        title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} post ${startIndex + i + 1} - Amazing content!`,
        author: {
          username: `user_${startIndex + i}`,
          avatar: `https://i.pravatar.cc/150?img=${(startIndex + i) % 70}`,
        },
        likes: Math.floor(Math.random() * 5000) + 100,
        isLiked: false,
      };
    });
  }, [mode]);

  // Simulate API call with cache
  const fetchPosts = useCallback(async (currentOffset: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);
    
    // Check session storage cache first
    const cacheKey = `${mode}-${currentOffset}`;
    const cached = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
    
    if (cached) {
      try {
        const cachedPosts = JSON.parse(cached);
        setPosts(prev => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const newPosts = cachedPosts.filter((p: Post) => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
        setOffset(currentOffset + cachedPosts.length);
        
        if (cachedPosts.length < 10) {
          setHasMore(false);
        }
      } catch (e) {
        console.error('Cache parse error:', e);
      }
      loadingRef.current = false;
      setIsLoading(false);
      return;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    // Generate mock posts
    const count = 10;
    const newPosts = generateMockPosts(currentOffset, count);

    // Cache the results
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(cacheKey, JSON.stringify(newPosts));
      }
    } catch (e) {
      console.warn('Session storage not available:', e);
    }

    setPosts(prev => [...prev, ...newPosts]);
    setOffset(currentOffset + count);
    
    // Stop after 50 posts
    if (currentOffset + count >= 50) {
      setHasMore(false);
    }
    
    loadingRef.current = false;
    setIsLoading(false);
  }, [mode, generateMockPosts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore && !loadingRef.current) {
          fetchPosts(offset);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '200px',
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [offset, isLoading, hasMore, fetchPosts]);

  // Reset when mode changes
  useEffect(() => {
    setPosts(initialPosts);
    setOffset(initialPosts.length);
    setHasMore(true);
    setIsLoading(false);
    loadingRef.current = false;
  }, [mode, initialPosts]);

  return (
    <div className="px-1 py-1.5">
      {/* Grid with posts */}
      <div 
        className="grid grid-cols-2 gap-1.5"
        style={{
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <XiaohongshuPost post={post} />
          </motion.div>
        ))}
      </div>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {isLoading && (
          <div className="flex gap-1 items-center">
            <motion.div 
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
            <motion.div 
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
            />
            <motion.div 
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
          </div>
        )}
        
        {!hasMore && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <div className="h-px bg-gray-200 w-32 mx-auto mb-3" />
            <span className="text-xs text-gray-400">You&apos;ve seen all posts</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default OptimizedFeed;
