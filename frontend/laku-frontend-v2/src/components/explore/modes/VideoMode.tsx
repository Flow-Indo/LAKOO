'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { XiaohongshuPost } from '../XiaohongshuPost';

const videoPosts = [
  {
    id: 'v1',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=533&fit=crop',
    title: 'Workout routine - Get fit with me!',
    author: { username: 'fitness_coach', avatar: 'https://i.pravatar.cc/150?img=5' },
    likes: 540,
  },
  {
    id: 'v2',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=533&fit=crop',
    title: 'Tech review - Latest gadgets!',
    author: { username: 'tech_reviewer', avatar: 'https://i.pravatar.cc/150?img=6' },
    likes: 765,
  },
  {
    id: 'v3',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=533&fit=crop',
    title: 'Sneaker collection update',
    author: { username: 'sneaker_head', avatar: 'https://i.pravatar.cc/150?img=7' },
    likes: 923,
  },
  {
    id: 'v4',
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=533&fit=crop',
    title: 'Home decor ideas for small spaces',
    author: { username: 'interior_design', avatar: 'https://i.pravatar.cc/150?img=8' },
    likes: 456,
  },
  {
    id: 'v5',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=533&fit=crop',
    title: 'Jacket styling tips',
    author: { username: 'style_guru', avatar: 'https://i.pravatar.cc/150?img=9' },
    likes: 678,
  },
  {
    id: 'v6',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=533&fit=crop',
    title: 'Walking in new shoes',
    author: { username: 'shoe_fan', avatar: 'https://i.pravatar.cc/150?img=12' },
    likes: 342,
  },
];

interface Post {
  id: string;
  image: string;
  title: string;
  author: { username: string; avatar: string };
  likes: number;
}

export function VideoMode() {
  const [posts, setPosts] = useState<Post[]>(videoPosts);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const newPosts = videoPosts.map(post => ({
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

export default VideoMode;
