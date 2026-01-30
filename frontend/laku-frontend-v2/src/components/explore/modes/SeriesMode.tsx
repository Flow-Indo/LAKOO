'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { XiaohongshuPost } from '../XiaohongshuPost';

const seriesPosts = [
  {
    id: 's1',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=533&fit=crop',
    title: 'Series: Summer Style Guide - Part 1',
    author: { username: 'style_series', avatar: 'https://i.pravatar.cc/150?img=30' },
    likes: 2341,
  },
  {
    id: 's2',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=533&fit=crop',
    title: 'Series: Summer Style Guide - Part 2',
    author: { username: 'style_series', avatar: 'https://i.pravatar.cc/150?img=30' },
    likes: 1892,
  },
  {
    id: 's3',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=533&fit=crop',
    title: 'Series: Home Makeover - Week 1',
    author: { username: 'reno_series', avatar: 'https://i.pravatar.cc/150?img=31' },
    likes: 3456,
  },
  {
    id: 's4',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=533&fit=crop',
    title: 'Series: Home Makeover - Week 2',
    author: { username: 'reno_series', avatar: 'https://i.pravatar.cc/150?img=31' },
    likes: 2876,
  },
  {
    id: 's5',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&h=533&fit=crop',
    title: 'Series: Beauty Routine - Morning',
    author: { username: 'beauty_series', avatar: 'https://i.pravatar.cc/150?img=32' },
    likes: 4521,
  },
  {
    id: 's6',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=533&fit=crop',
    title: 'Series: Beauty Routine - Night',
    author: { username: 'beauty_series', avatar: 'https://i.pravatar.cc/150?img=32' },
    likes: 3987,
  },
];

interface Post {
  id: string;
  image: string;
  title: string;
  author: { username: string; avatar: string };
  likes: number;
}

export function SeriesMode() {
  const [posts, setPosts] = useState<Post[]>(seriesPosts);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const newPosts = seriesPosts.map(post => ({
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

export default SeriesMode;
