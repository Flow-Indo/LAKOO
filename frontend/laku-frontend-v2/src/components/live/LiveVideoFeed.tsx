'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Heart, ShoppingCart, Share2, User, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice } from '@/lib/formatters';
import { MOCK_LIVE_VIDEOS, LiveVideo } from '@/lib/mock-live-data';

interface VideoCardProps {
  video: LiveVideo;
  isActive: boolean;
}

function VideoCard({ video, isActive }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const router = useRouter();
  const { addItem } = useCartStore();
  const { t } = useLanguage();

  // Handle video play/pause based on active state
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {
          // Handle autoplay restrictions
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddToCart = () => {
    addItem(video.product);
    // Could add toast notification here
  };

  const handleBuyNow = () => {
    addItem(video.product);
    setShowProductDetail(true);
    // In a real app, this would navigate to checkout
  };

  return (
    <div className="relative h-screen w-full snap-start snap-always bg-black">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnail}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
      />

      {/* Overlay UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20">
        {/* TOP: Exit Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RIGHT SIDE: Vertical Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col space-y-4">
          {/* Store Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
              <img
                src={video.store.avatar}
                alt={video.store.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Like Button */}
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={handleLike}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-white text-xs font-medium">{likes}</span>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={handleAddToCart}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
            </button>
            <span className="text-white text-xs font-medium">{t('action.add_to_cart')}</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center space-y-1">
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
            <span className="text-white text-xs font-medium">{t('action.share')}</span>
          </div>
        </div>

        {/* BOTTOM: Product Info Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gradient-to-t from-black/80 to-transparent rounded-t-2xl p-4">
            {/* Store Info */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-white text-sm font-medium drop-shadow-lg">
                {video.store.name}
              </span>
              <span className="text-white/70 text-xs drop-shadow-lg">
                • {video.viewers} watching
              </span>
            </div>

            {/* Product Info */}
            <h3 className="text-white text-lg font-semibold mb-1 drop-shadow-lg line-clamp-2">
              {video.product.name}
            </h3>

            <div className="flex items-center justify-between mb-4">
              <span className="text-white text-xl font-bold drop-shadow-lg">
                {formatPrice(video.product.price)}
              </span>
              {video.product.discount && (
                <span className="text-green-400 text-sm font-medium drop-shadow-lg">
                  {video.product.discount}% OFF
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowProductDetail(true)}
                className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-medium hover:bg-white/30 transition-colors"
              >
                {t('product.view_details')}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                {t('action.buy_now')}
              </button>
            </div>
          </div>
        </div>

        {/* Product Detail Modal */}
        {showProductDetail && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-end z-20">
            <div className="w-full bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{video.product.name}</h2>
                <button
                  onClick={() => setShowProductDetail(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="aspect-square w-full bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={video.product.image}
                    alt={video.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(video.product.price)}
                    </span>
                    {video.product.discount && (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                        {video.product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {video.product.description}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    {t('action.add_to_cart')}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 transition-colors"
                  >
                    {t('action.buy_now')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function LiveVideoFeed() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll to detect current video
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      setCurrentVideoIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
    >
      {MOCK_LIVE_VIDEOS.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          isActive={index === currentVideoIndex}
        />
      ))}

      {/* Loading indicator at the end */}
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading more videos...</p>
        </div>
      </div>
    </div>
  );
}