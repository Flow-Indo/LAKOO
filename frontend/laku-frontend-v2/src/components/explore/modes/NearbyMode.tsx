'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { XiaohongshuPost } from '../XiaohongshuPost';

const nearbyPosts = [
  {
    id: 'n1',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=533&fit=crop',
    title: 'Nearby: Best cafe near you! Coffee & vibes',
    author: { username: 'local_cafe_guide', avatar: 'https://i.pravatar.cc/150?img=20' },
    likes: 445,
  },
  {
    id: 'n2',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=533&fit=crop',
    title: 'Nearby: Hidden gem restaurant downtown',
    author: { username: 'food_hunter', avatar: 'https://i.pravatar.cc/150?img=21' },
    likes: 678,
  },
  {
    id: 'n3',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=533&fit=crop',
    title: 'Nearby: Weekend market near you',
    author: { username: 'market_discovery', avatar: 'https://i.pravatar.cc/150?img=22' },
    likes: 892,
  },
  {
    id: 'n4',
    image: 'https://images.unsplash.com/photo-1442504028988-86d18c121c5a?w=400&h=533&fit=crop',
    title: 'Nearby: Park picnic spots you missed',
    author: { username: 'nature_finder', avatar: 'https://i.pravatar.cc/150?img=23' },
    likes: 334,
  },
  {
    id: 'n5',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400&h=533&fit=crop',
    title: 'Nearby: Street food favorites',
    author: { username: 'street_food_lover', avatar: 'https://i.pravatar.cc/150?img=24' },
    likes: 1123,
  },
  {
    id: 'n6',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=400&h=533&fit=crop',
    title: 'Nearby: New boutique opened yesterday',
    author: { username: 'shop_local', avatar: 'https://i.pravatar.cc/150?img=25' },
    likes: 567,
  },
];

interface Post {
  id: string;
  image: string;
  title: string;
  author: { username: string; avatar: string };
  likes: number;
}

export function NearbyMode() {
  const [posts, setPosts] = useState<Post[]>(nearbyPosts);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const newPosts = nearbyPosts.map(post => ({
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

export default NearbyMode;
