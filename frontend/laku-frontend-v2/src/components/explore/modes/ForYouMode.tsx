'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { XiaohongshuPost } from '../XiaohongshuPost';

// Import product data for posts
import { productsData } from '@/lib/products-data';

// Transform product data to post format for explore feed
const forYouPosts = Object.values(productsData).map((product) => ({
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

interface Post {
  id: string;
  image: string;
  title: string;
  author: { username: string; avatar: string };
  likes: number;
}

export function ForYouMode() {
  const [posts, setPosts] = useState<Post[]>(forYouPosts);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);

  const loadMorePosts = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      // Duplicate existing posts for infinite scroll effect
      const newPosts = forYouPosts.map(post => ({
        ...post,
        id: `${post.id}_${Date.now()}_${Math.random()}`,
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
