'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { XiaohongshuPost } from '../XiaohongshuPost';

const forYouPosts = [
  {
    id: 'fy1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=533&fit=crop',
    title: 'New fashion collection 2024!',
    author: { username: 'fashionista_id', avatar: 'https://i.pravatar.cc/150?img=1' },
    likes: 501,
  },
  {
    id: 'fy2',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=533&fit=crop',
    title: 'Shopping haul! Got these deals',
    author: { username: 'lifestyle_guru', avatar: 'https://i.pravatar.cc/150?img=2' },
    likes: 183,
  },
  {
    id: 'fy3',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=533&fit=crop',
    title: 'Best meal of the day! Recipe inside',
    author: { username: 'foodie_adventures', avatar: 'https://i.pravatar.cc/150?img=3' },
    likes: 890,
  },
  {
    id: 'fy4',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=533&fit=crop',
    title: 'Paradise found! Travel goals',
    author: { username: 'travel_diary', avatar: 'https://i.pravatar.cc/150?img=4' },
    likes: 1200,
  },
  {
    id: 'fy5',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=533&fit=crop',
    title: 'Morning workout routine',
    author: { username: 'fitness_coach', avatar: 'https://i.pravatar.cc/150?img=5' },
    likes: 540,
  },
  {
    id: 'fy6',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=533&fit=crop',
    title: 'Latest tech gadgets review',
    author: { username: 'tech_reviewer', avatar: 'https://i.pravatar.cc/150?img=6' },
    likes: 765,
  },
];

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
