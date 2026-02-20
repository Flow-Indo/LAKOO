'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Bookmark, ShoppingCart, Star, ChevronRight } from 'lucide-react';
import type { LiveShoppingVideo } from '@/types/live-shopping';
import { CommentSheet } from './CommentSheet';

interface ScrollVideoFeedProps {
  videos: LiveShoppingVideo[];
  onSwipeBack?: () => void;
  onCommentOpen?: () => void;
  onCommentClose?: () => void;
}

interface ScrollPost {
  id: string;
  images: string[];
  videoUrl?: string;
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
  products?: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    sold?: number;
  }[];
}

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  text: string;
  likes: number;
  isLiked?: boolean;
  timestamp: string;
  replies?: Comment[];
}

// Transform live shopping videos to scroll post format
const transformToScrollPosts = (videos: LiveShoppingVideo[]): ScrollPost[] => {
  if (!videos || !Array.isArray(videos)) return [];
  
  const result: ScrollPost[] = [];
  
  for (const video of videos) {
    if (!video) continue;
    
    const products = (video.products || []).filter(Boolean).map((product, idx) => ({
      id: product?.id || `product-${video.id}-${idx}`,
      name: product?.name || 'Unknown Product',
      price: product?.price || 0,
      originalPrice: product?.originalPrice,
      image: product?.image || video.thumbnailUrl,
      sold: product?.sold || Math.floor(Math.random() * 5000) + 100,
    }));
    
    result.push({
    id: video.id,
    images: [video.thumbnailUrl],
      videoUrl: video.videoUrl,
    title: video.title,
    description: video.description || 'Check out our amazing products!',
    author: {
        username: video.shop?.name || 'Unknown',
        avatar: video.shop?.logo || '/placeholder-avatar.png',
        isFollowing: video.shop?.isFollowing,
    },
    likes: video.likes || 0,
    comments: video.viewers || 0,
    shares: Math.floor((video.viewers || 0) / 10),
    isLiked: video.isLiked,
      products,
    });
  }
  
  return result;
};

// Mock comments data
const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    user: {
      username: 'fashion_lover',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    text: 'This is amazing! Where can I get this? 😍',
    likes: 24,
    timestamp: '2h ago',
    replies: [
      {
        id: '1-1',
        user: {
          username: 'shop_official',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        },
        text: 'Check the link in bio! ✨',
        likes: 5,
        timestamp: '1h ago',
      },
    ],
  },
  {
    id: '2',
    user: {
      username: 'style_guru',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    text: 'Love this look! Perfect for summer 🌞',
    likes: 18,
    timestamp: '3h ago',
  },
  {
    id: '3',
    user: {
      username: 'shopaholic_queen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    text: 'Just ordered! Cant wait to receive it 🙏',
    likes: 12,
    timestamp: '5h ago',
    replies: [
      {
        id: '3-1',
        user: {
          username: 'happy_customer',
          avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
        },
        text: 'You will love it! Quality is top notch 💯',
        likes: 3,
        timestamp: '4h ago',
      },
      {
        id: '3-2',
        user: {
          username: 'fashionista_jen',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        },
        text: 'Same here! Ordered last week, arriving tomorrow!',
        likes: 2,
        timestamp: '4h ago',
      },
    ],
  },
  {
    id: '4',
    user: {
      username: 'trendy_buyer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    text: 'Best price I have found anywhere!',
    likes: 8,
    timestamp: '6h ago',
  },
  {
    id: '5',
    user: {
      username: 'beauty_expert',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    },
    text: 'This is exactly what I was looking for 🔥',
    likes: 31,
    timestamp: '1d ago',
  },
];

export function ScrollVideoFeed({ videos, onSwipeBack, onCommentOpen, onCommentClose }: ScrollVideoFeedProps) {
  const [posts, setPosts] = useState<ScrollPost[]>(transformToScrollPosts(videos));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set());
  const [showHeartAnimation, setShowHeartAnimation] = useState<string | null>(null);
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const currentPost = posts[currentIndex];

  const handleLike = useCallback((postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
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

  const handleBookmark = useCallback((postId: string) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const toggleCaption = useCallback((postId: string) => {
    setExpandedCaptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const handleDoubleTap = useCallback((postId: string) => {
    if (!likedPosts.has(postId)) {
      handleLike(postId);
    }
    // Show heart animation
    setShowHeartAnimation(postId);
    setTimeout(() => setShowHeartAnimation(null), 1000);
  }, [likedPosts]);

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

  // Handle play/pause when scrolling
  useEffect(() => {
    const currentPost = posts[currentIndex];
    if (!currentPost || !currentPost.videoUrl) return;
    
    const videoEl = document.querySelector(`[data-video-id="${currentPost.id}"]`) as HTMLVideoElement;
    if (!videoEl) return;

    if (isPlaying) {
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  }, [isPlaying, currentIndex, posts]);

  // Auto-play when scrolling to a new video
  useEffect(() => {
    const currentPost = posts[currentIndex];
    if (!currentPost || !currentPost.videoUrl) return;

    // Find the video element directly in the DOM
    const videoEl = document.querySelector(`[data-video-id="${currentPost.id}"]`) as HTMLVideoElement;
    if (!videoEl) return;

    videoEl.currentTime = 0;
    setIsPlaying(true);
  }, [currentIndex, posts]);

  const togglePlay = () => {
    const currentPost = posts[currentIndex];
    if (!currentPost || !currentPost.videoUrl) return;
    
    const videoEl = document.querySelector(`[data-video-id="${currentPost.id}"]`) as HTMLVideoElement;
    if (!videoEl) return;
    
    if (isPlaying) {
      videoEl.pause();
    } else {
      videoEl.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  // Pause video when comment sheet opens, resume when it closes
  useEffect(() => {
    const currentPost = posts[currentIndex];
    if (!currentPost || !currentPost.videoUrl) return;
    
    const videoEl = document.querySelector(`[data-video-id="${currentPost.id}"]`) as HTMLVideoElement;
    if (!videoEl) return;

    if (showCommentSheet) {
      videoEl.pause();
    } else {
      videoEl.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [showCommentSheet, currentIndex, posts]);

  return (
    <div 
      ref={containerRef}
      className="w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ 
          scrollSnapType: 'y mandatory', 
          height: '100dvh',
          backgroundColor: '#000'
        }}
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
          style={{ scrollSnapAlign: 'start', height: '100dvh', zIndex: 1, backgroundColor: '#000' }}
        >
          {/* Background Image/Video - hidden when comment sheet is open */}
          <div 
            className={`absolute inset-0 transition-opacity duration-300 ${showCommentSheet ? 'opacity-0 pointer-events-none' : ''}`}
            style={{ backgroundColor: '#000' }}
            onClick={togglePlay}
            onDoubleClick={() => handleDoubleTap(post.id)}
          >
            {/* Video element - always visible */}
            {post.videoUrl ? (
              <video
                key={post.id}
                data-video-id={post.id}
                src={post.videoUrl}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
                playsInline
                preload="auto"
                autoPlay={index === currentIndex}
              />
            ) : (
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              className="object-cover"
              priority={index === currentIndex}
            />
            )}
            
            {/* Play/Pause indicator overlay */}
            {!isPlaying && index === currentIndex && post.videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            
            {/* Heart Animation on Double Tap */}
            {showHeartAnimation === post.id && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[90]">
                <Heart className="w-24 h-24 text-white fill-white animate-ping" strokeWidth={1} />
              </div>
            )}
          </div>

          {/* Bottom Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-22 z-[70] pr-14">
            {/* Author */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-semibold text-base">
                @{post.author.username}
              </span>
              {post.author.isFollowing ? (
                <button 
                  onClick={() => handleFollow(post.id)}
                  className="text-xs text-white/70 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md font-medium transition-colors"
                >
                  Mengikuti
                </button>
              ) : (
                <button 
                  onClick={() => handleFollow(post.id)}
                  className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-0.5 rounded-md font-medium transition-colors"
                >
                  Follow
                </button>
              )}
            </div>

            {/* Description with expand - tappable */}
            <div 
              onClick={() => toggleCaption(post.id)}
              className="text-white text-sm mb-1 cursor-pointer"
            >
              <span className={expandedCaptions.has(post.id) ? '' : 'line-clamp-2'}>
              {post.description}
              </span>
              {!expandedCaptions.has(post.id) && post.description.length > 80 && (
                <span className="text-white/60">... more</span>
              )}
            </div>
          </div>

          {/* Right Side - Interaction Buttons */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 z-[80] pointer-events-auto">
            {/* Like Button */}
            <button 
              onClick={() => handleLike(post.id)}
              className="flex flex-col items-center gap-1.5 pointer-events-auto"
            >
              <Heart 
                className={`w-7 h-7 transition-all ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                strokeWidth={2}
              />
              <span className="text-white text-[10px] font-medium">
                {formatNumber(post.likes)}
              </span>
            </button>

            {/* Comment Button */}
            <button 
              onClick={() => {
                setShowCommentSheet(true);
              }}
              className="flex flex-col items-center gap-1.5 pointer-events-auto"
            >
              <MessageCircle className="w-7 h-7 text-white" strokeWidth={2} />
              <span className="text-white text-[10px] font-medium">
                {formatNumber(post.comments)}
              </span>
            </button>

            {/* Share Button */}
            <button 
              onClick={() => {
                // Share functionality - for now just log
                console.log('Share post:', post.id);
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.description,
                    url: window.location.href,
                  }).catch(() => {});
                }
              }}
              className="flex flex-col items-center gap-1.5 pointer-events-auto"
            >
              <Share2 className="w-7 h-7 text-white" strokeWidth={2} />
              <span className="text-white text-[10px] font-medium">
                {formatNumber(post.shares)}
              </span>
            </button>

            {/* Bookmark Button */}
            <button 
              onClick={() => handleBookmark(post.id)}
              className="flex flex-col items-center gap-1.5 pointer-events-auto"
            >
              <Bookmark 
                className={`w-7 h-7 transition-all ${bookmarkedPosts.has(post.id) ? 'fill-white text-white' : 'text-white'}`} 
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      <div className="h-16 flex items-center justify-center" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>

      {/* Sticky Bottom Bar - Tagged Products */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-black border-t border-gray-800" style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}>
        <div className="px-3 pt-2 pb-6">
          {currentPost?.products && currentPost.products.length === 1 ? (
            /* Single Product - Show Full Details */
            <div className="relative">
              <Link
                href={`/product/${currentPost.products[0].id}`}
                className="flex items-center p-1.5 rounded-md hover:bg-white/5 transition-colors group w-full block"
              >
                <div className="relative w-10 h-10 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={currentPost.products[0].image || currentPost.images[0]}
                    alt={currentPost.products[0].name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="48px"
                  />
                </div>
                <div className="pl-3 flex-1 min-w-0 pr-14 overflow-hidden">
                  <p className="text-[11px] text-white/70 truncate">
                    {currentPost.products[0].name}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-white text-[12px] font-semibold">
                      {formatPrice(currentPost.products[0].price)}
                    </span>
                    {currentPost.products[0].originalPrice && (
                      <span className="text-gray-500 text-[10px] line-through">
                        {formatPrice(currentPost.products[0].originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              {/* Right: Buttons */}
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </button>
                <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                  <Star className="w-4 h-4 text-white" />
          </button>
              </div>
            </div>
          ) : currentPost?.products && currentPost.products.length > 1 ? (
            /* Multiple Products - Show Thumbnails with Quantity */
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-1">
                {currentPost.products.slice(0, 3).map((product) => (
                  <div key={product.id} className="relative w-10 h-10 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image || currentPost.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 text-white text-[12px] font-semibold">
                <span>{currentPost.products.length} produk</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Comment Sheet */}
      <CommentSheet
        visible={showCommentSheet}
        onClose={() => setShowCommentSheet(false)}
        onCommentOpen={onCommentOpen}
        onCommentClose={onCommentClose}
        videoUrl={currentPost?.videoUrl}
        videoThumbnail={currentPost?.images[0]}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        comments={MOCK_COMMENTS}
        onLikeComment={(commentId) => {
          console.log('Liked comment:', commentId);
        }}
        currentUser={{
          username: 'your_username',
          avatar: '/placeholder-avatar.png',
        }}
      />
    </div>
  );
}

export default ScrollVideoFeed;
