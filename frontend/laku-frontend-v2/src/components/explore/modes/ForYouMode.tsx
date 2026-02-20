'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { XiaohongshuPost } from '../XiaohongshuPost';

// Import product data for posts
import { productsData } from '@/lib/products-data';

// Only show posts from these brands in the explore feed
// Exclude standalone products like Prada Tote, MM Tabi, Stanley Quencher
const EXPLORE_FEED_BRANDS = [
  'CULT SURI',
  'Karakiri',
  'RUE',
  'WEAR THREEK',
  'Lululemon',
  'Luxury Collection', // For combo posts
];

// Transform product data to post format for explore feed
const forYouPosts = Object.values(productsData)
  .filter((product) => EXPLORE_FEED_BRANDS.includes(product.brand))
  .map((product) => ({
    id: product.slug,
    image: product.postImages[0], // Use first post image
    title: product.postData.title,
    author: {
      username: product.postData.author.name,
      avatar: product.postData.author.avatar,
    },
    likes: product.postData.interactions.likes,
    isLiked: false,
  }));

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface Post {
  id: string;
  image: string;
  title: string;
  author: { username: string; avatar: string };
  likes: number;
}

export function ForYouMode() {
  // Start with original order for SSR (no hydration mismatch)
  const [posts, setPosts] = useState<Post[]>(forYouPosts);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const shuffledRef = useRef<Post[] | null>(null);

  // Only shuffle on client after mount to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    // Shuffle once on client mount
    shuffledRef.current = shuffleArray(forYouPosts);
    setPosts(shuffledRef.current);
  }, []);

  const loadMorePosts = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      // Use the shuffled posts reference
      const sourcePosts = shuffledRef.current || forYouPosts;
      const shuffledPosts = shuffleArray(sourcePosts);
      const newPosts = shuffledPosts.map((post, index) => ({
        ...post,
        // Generate unique ID using index instead of random
        id: `${post.id}_load${pageRef.current}_idx${index}`,
      }));
      
      setPosts(prev => [...prev, ...newPosts]);
      pageRef.current += 1;
      setLoading(false);
    }, 300);
  }, [loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMorePosts();
        }
      },
      { rootMargin: '200px' }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, loading]);

  return (
    <div className="px-1 py-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        {posts.map((post) => (
          <XiaohongshuPost key={post.id} post={post as any} />
        ))}
      </div>
      
      {/* Infinite scroll trigger */}
      <div ref={observerRef} className="h-4" />
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#ff2742] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default ForYouMode;
