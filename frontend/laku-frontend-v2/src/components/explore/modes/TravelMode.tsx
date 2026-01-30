'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { XiaohongshuPost } from '../XiaohongshuPost';

const travelPosts = [
  {
    id: 't1',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=533&fit=crop',
    title: 'Travel: Bali adventure - Beach paradise',
    author: { username: 'travel_wanderer', avatar: 'https://i.pravatar.cc/150?img=40' },
    likes: 8976,
  },
  {
    id: 't2',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=533&fit=crop',
    title: 'Travel: Mountain hiking in Switzerland',
    author: { username: 'mountain_seeker', avatar: 'https://i.pravatar.cc/150?img=41' },
    likes: 6543,
  },
  {
    id: 't3',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=533&fit=crop',
    title: 'Travel: Resort life in Maldives',
    author: { username: 'luxury_travel', avatar: 'https://i.pravatar.cc/150?img=42' },
    likes: 12340,
  },
  {
    id: 't4',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=533&fit=crop',
    title: 'Travel: Lake Como - Italy hidden gems',
    author: { username: 'europe_explorer', avatar: 'https://i.pravatar.cc/150?img=43' },
    likes: 7654,
  },
  {
    id: 't5',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=533&fit=crop',
    title: 'Travel: Road trip across New Zealand',
    author: { username: 'road_tripper', avatar: 'https://i.pravatar.cc/150?img=44' },
    likes: 5432,
  },
  {
    id: 't6',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=533&fit=crop',
    title: 'Travel: Desert safari in Dubai',
    author: { username: 'adventure_seeker', avatar: 'https://i.pravatar.cc/150?img=45' },
    likes: 9876,
  },
];

interface Post {
  id: string;
  image: string;
  title: string;
  author: { username: string; avatar: string };
  likes: number;
}

export function TravelMode() {
  const [posts, setPosts] = useState<Post[]>(travelPosts);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const newPosts = travelPosts.map(post => ({
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

export default TravelMode;
