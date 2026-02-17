'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, Plus, Music, Volume2, VolumeX, Star } from 'lucide-react';
import type { LiveShoppingVideo } from '@/types/live-shopping';

interface ScrollVideoFeedProps {
  videos: LiveShoppingVideo[];
  onSwipeBack?: () => void;
}

interface ScrollPost {
  id: string;
  images: string[];
  title: string;
  description: string;
  author: {
    username: string;
    avatar: string;
    isFollowing?: boolean;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  product?: {
    name: string;
    price: number;
    originalPrice?: number;
  };
  audioCredit: string;
}

// Transform live shopping videos to scroll post format
const transformToScrollPosts = (videos: LiveShoppingVideo[]): ScrollPost[] => {
  return videos.map((video) => ({
    id: video.id,
    images: [video.thumbnailUrl],
    title: video.title,
    description: video.description || 'Check out our amazing products!',
    author: {
      username: video.shop.name,
      avatar: video.shop.logo,
      isFollowing: video.shop.isFollowing,
    },
    likes: video.likes || 0,
    comments: video.viewers || 0,
    shares: Math.floor((video.viewers || 0) / 10),
    isLiked: video.isLiked,
    product: video.products[0] ? {
      name: video.products[0].name,
      price: video.products[0].price,
      originalPrice: video.products[0].originalPrice,
    } : undefined,
    audioCredit: 'Original Sound - ' + video.shop.name,
  }));
};

export function ScrollVideoFeed({ videos, onSwipeBack }: ScrollVideoFeedProps) {
  const [posts, setPosts] = useState<ScrollPost[]>(transformToScrollPosts(videos));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [bottomBarLiked, setBottomBarLiked] = useState(false);
  const [bottomBarFavorited, setBottomBarFavorited] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const currentPost = posts[currentIndex];

  const handleLike = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  }, []);

  const handleFollow = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          author: {
            ...post.author,
            isFollowing: !post.author.isFollowing,
          },
        };
      }
      return post;
    }));
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, posts.length]);

  // Load more posts when reaching the end
  useEffect(() => {
    if (currentIndex >= posts.length - 2) {
      const morePosts = transformToScrollPosts(videos).map(post => ({
        ...post,
        id: `${post.id}_${Date.now()}_${Math.random()}`,
      }));
      setPosts(prev => [...prev, ...morePosts]);
    }
  }, [currentIndex, posts.length, videos]);

  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined || price === null) return '';
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  return (
    <div 
      ref={containerRef}
      className="w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollSnapType: 'y mandatory', height: '100dvh' }}
      onScroll={handleScroll}
      onTouchStart={(e) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (!touchStartRef.current) return;
        const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        const deltaX = touchEnd.x - touchStartRef.current.x;
        const deltaY = touchEnd.y - touchStartRef.current.y;
        
        // Only trigger swipe back if horizontal movement is greater than vertical
        // and horizontal movement is significant (more than 100px)
        if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 100 && onSwipeBack) {
          onSwipeBack();
        }
        touchStartRef.current = null;
      }}
    >
      {posts.map((post, index) => (
        <div 
          key={post.id}
          className="w-full relative snap-start"
          style={{ scrollSnapAlign: 'start', height: '100dvh' }}
        >
          {/* Background Image/Video */}
          <div className="absolute inset-0">
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              className="object-cover"
              priority={index === currentIndex}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>

          {/* Bottom Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-16 z-[70]">
            {/* Author */}
            <div className="flex items-center gap-1">
              <span className="text-white font-semibold text-base">
                @{post.author.username}
              </span>
              {post.author.isFollowing && (
                <span className="text-xs text-white/70 bg-white/20 px-2 py-0.5 rounded-full">
                  Following
                </span>
              )}
            </div>

            {/* Description */}
            <p className="py-2 text-white text-sm mb-3 line-clamp-2">
              {post.description}
            </p>

            {/* Product Tag */}
            {post.product && (
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 mb-3">
                <span className="text-white text-sm font-medium">
                  {post.product.name}
                </span>
                <span className="text-white text-sm">
                  {formatPrice(post.product.price)}
                </span>
                {post.product.originalPrice && (
                  <span className="text-white/60 text-xs line-through">
                    {formatPrice(post.product.originalPrice)}
                  </span>
                )}
              </div>
            )}

            {/* Audio Credit with Music Icon */}
            <div className="py-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-white" />
              <span className="text-white text-xs truncate">
                {post.audioCredit}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      <div className="h-16 flex items-center justify-center" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-gray-800" style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-between px-4 py-3 mx-auto" style={{ maxWidth: '400px' }}>
          {/* Left: Comment Input Button */}
          <button className="flex items-center gap-2 px-6 h-9 rounded-full hover:bg-gray-500 transition-colors" style={{ backgroundColor: '#212121' }}>
            <MessageCircle className="w-4 h-4" style={{ color: '#9d9d9d' }} />
            <span className="text-[14px]" style={{ color: '#9d9d9d' }}>Tulis komentar</span>
          </button>

          {/* Right: Action Icons with Counts */}
          <div className="flex items-center gap-3">
            {/* Like */}
            <button
              onClick={() => setBottomBarLiked(!bottomBarLiked)}
              className="flex items-center gap-1.5 min-w-[44px] group"
            >
              <Heart
                className={`w-6 h-6 transition-all ${
                  bottomBarLiked ? 'fill-red-500 text-red-500' : 'text-white group-hover:text-gray-300'
                }`}
                strokeWidth={1.5}
              />
              <span className={`text-[12px] font-medium ${
                bottomBarLiked ? 'text-red-500' : 'text-white'
              }`}>
                {formatNumber(currentPost?.likes || 0)}
              </span>
            </button>

            {/* Favorite */}
            <button
              onClick={() => setBottomBarFavorited(!bottomBarFavorited)}
              className="flex items-center gap-1.5 min-w-[44px] group"
            >
              <Star
                className={`w-6 h-6 transition-all ${
                  bottomBarFavorited ? 'fill-yellow-400 text-yellow-400' : 'text-white group-hover:text-gray-300'
                }`}
                strokeWidth={1.5}
              />
              <span className={`text-[12px] font-medium ${
                bottomBarFavorited ? 'text-yellow-400' : 'text-white'
              }`}>
                {formatNumber(currentPost?.likes ? Math.floor(currentPost.likes * 0.3) : 0)}
              </span>
            </button>

            {/* Comments */}
            <button className="flex items-center gap-1.5 min-w-[44px] group">
              <MessageCircle
                className="w-6 h-6 text-white group-hover:text-gray-300"
                strokeWidth={1.5}
              />
              <span className="text-[12px] font-medium text-white group-hover:text-gray-300">
                {formatNumber(currentPost?.comments || 0)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrollVideoFeed;
