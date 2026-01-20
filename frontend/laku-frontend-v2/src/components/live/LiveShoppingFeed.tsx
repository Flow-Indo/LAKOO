'use client';

import { useState, useRef, useEffect } from 'react';
import { LiveNavBar } from './LiveNavBar';
import { MobileVideoHeader } from './MobileVideoHeader';
import { LiveVideoPlayer } from './LiveVideoPlayer';
import { LiveActionBar } from './LiveActionBar';
import { VideoShopInfo } from './VideoShopInfo';
import { VideoMobileInfoOverlay } from './VideoMobileInfoOverlay';
import { CommentDrawer } from './CommentDrawer';
import type { LiveShoppingVideo, LiveCategory } from '@/types/live-shopping';

interface Props {
  initialVideos: LiveShoppingVideo[];
}

export function LiveShoppingFeed({ initialVideos }: Props) {
  const [videos, setVideos] = useState<LiveShoppingVideo[]>(initialVideos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<LiveCategory>('all');
  const [showComments, setShowComments] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentVideo = videos[currentIndex];

  const handleCategoryChange = async (category: LiveCategory) => {
    setSelectedCategory(category);
    // TODO: Fetch videos for this category
    const newVideos = await fetch(`/api/live/feed?category=${category}`)
      .then(r => r.json())
      .catch(() => []);
    setVideos(newVideos);
    setCurrentIndex(0);
  };

  // Video interaction handlers for desktop action bar
  const handleLike = (videoIndex: number) => {
    setVideos(videos.map((v, i) =>
      i === videoIndex ? {
        ...v,
        isLiked: !v.isLiked,
        likes: v.isLiked ? v.likes - 1 : v.likes + 1,
      } : v
    ));
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleFollow = (shopId: string) => {
    setVideos(videos.map(video =>
      video.shop.id === shopId
        ? {
            ...video,
            shop: {
              ...video.shop,
              isFollowing: !video.shop.isFollowing,
              followers: video.shop.isFollowing
                ? video.shop.followers - 1
                : video.shop.followers + 1
            }
          }
        : video
    ));
  };

  const handleShopClick = () => {
    // Navigate to shop page - for now just log
    console.log('Navigate to shop:', currentVideo?.shop.name);
  };


  // Track which video is currently active based on scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, videos.length]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileVideoHeader
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Desktop: Category Tabs */}
      <div className="hidden md:block fixed top-20 left-[72px] xl:left-[245px] right-0 z-30 px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 max-w-[500px] mx-auto overflow-x-auto scrollbar-hide">
          {[
            { id: 'all' as LiveCategory, label: 'All' },
            { id: 'following' as LiveCategory, label: 'Following' },
            { id: 'fashion' as LiveCategory, label: 'Fashion' },
            { id: 'beauty' as LiveCategory, label: 'Beauty' },
            { id: 'electronics' as LiveCategory, label: 'Electronic' },
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                selectedCategory === category.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Action Bar - Outside Video Frame */}
      <div className="hidden md:block fixed top-1/2 right-8 -translate-y-1/2 z-40">
        {currentVideo && (
          <LiveActionBar
            shop={currentVideo.shop}
            likes={currentVideo.likes}
            comments={currentVideo.comments}
            isLiked={currentVideo.isLiked}
            onFollow={() => handleFollow(currentVideo.shop.id)}
            onLike={() => handleLike(currentIndex)}
            onComment={handleComment}
            onShare={() => {}}
            onMore={() => {}}
          />
        )}
      </div>

      {/* Video Container - Same scrolling behavior for all devices */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {/* Scrollable Video Feed for All Devices */}
        {videos.map((video, index) => (
          <div key={video.id} className="h-screen snap-start snap-always relative">
            <LiveVideoPlayer
              video={video}
              isActive={index === currentIndex}
              onVideoUpdate={(updatedVideo) => {
                setVideos(videos.map((v, i) => (i === index ? updatedVideo : v)));
                // Update currentVideo when the active video changes
                if (index === currentIndex) {
                  // This will trigger a re-render of the action bar with updated data
                }
              }}
            />

            {/* TikTok-style Overlays */}
            {index === currentIndex && (
              <>
                {/* Shop Info Overlay - Desktop Only */}
                <div className="hidden md:block">
                  <VideoShopInfo
                    shop={video.shop}
                    description={video.description}
                    productName={video.products[video.currentProductIndex]?.name || ''}
                    onShopClick={handleShopClick}
                  />
                </div>

                {/* Mobile Info Overlay - Above Footer */}
                <VideoMobileInfoOverlay
                  shop={video.shop}
                  product={video.products[video.currentProductIndex]}
                  description={video.description}
                />
              </>
            )}
          </div>
        ))}
      </div>


      {/* Desktop Comment Drawer */}
      {showComments && currentVideo && (
        <CommentDrawer
          videoId={currentVideo.id}
          commentCount={currentVideo.comments}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
}