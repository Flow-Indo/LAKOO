'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { XiaohongshuPost } from '../XiaohongshuPost';

const livePosts = [
  {
    id: 'l1',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=533&fit=crop',
    title: 'Live: Fashion show happening now!',
    author: { username: 'fashion_live', avatar: 'https://i.pravatar.cc/150?img=10' },
    likes: 2340,
  },
  {
    id: 'l2',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=533&fit=crop',
    title: 'Live: Cooking live stream - Italian food',
    author: { username: 'chef_live', avatar: 'https://i.pravatar.cc/150?img=11' },
    likes: 1567,
  },
  {
    id: 'l3',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=533&fit=crop',
    title: 'Live: Makeup tutorial with new products',
    author: { username: 'beauty_live', avatar: 'https://i.pravatar.cc/150?img=13' },
    likes: 3421,
  },
  {
    id: 'l4',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=533&fit=crop',
    title: 'Live: Travel vlog from Bali',
    author: { username: 'travel_live', avatar: 'https://i.pravatar.cc/150?img=14' },
    likes: 1890,
  },
  {
    id: 'l5',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=533&fit=crop',
    title: 'Live: Tech unboxing - Surprise reveal!',
    author: { username: 'tech_live', avatar: 'https://i.pravatar.cc/150?img=15' },
    likes: 4521,
  },
  {
    id: 'l6',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=533&fit=crop',
    title: 'Live: Flash sale - Limited time only!',
    author: { username: 'shop_live', avatar: 'https://i.pravatar.cc/150?img=16' },
    likes: 8765,
  },
];

interface Post {
  id: string;
  image: string;
  title: string;
  author: { username: string; avatar: string };
  likes: number;
}

export function LiveMode() {
  const [posts, setPosts] = useState<Post[]>(livePosts);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const newPosts = livePosts.map(post => ({
        ...post,
        id: `${post.id}_${Date.now()}_${Math.random()}`,
      }));
      
      setPosts(prev => [...prev, ...newPosts]);
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
      
      <div ref={observerRef} className="h-4" />
      
      {loading && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#ff2742] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default LiveMode;
