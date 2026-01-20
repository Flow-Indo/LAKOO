'use client';

import { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, ShoppingCart, Play, Pause, Plus } from 'lucide-react';
import { ProductCarousel } from './ProductCarousel';
import { LiveActionBar } from './LiveActionBar';
import { CommentDrawer } from './CommentDrawer';
import type { LiveShoppingVideo } from '@/types/live-shopping';

interface Props {
  video: LiveShoppingVideo;
  isActive: boolean;
  onVideoUpdate: (video: LiveShoppingVideo) => void;
}

export function LiveVideoPlayer({ video, isActive, onVideoUpdate }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive && !isPaused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPaused]);

  const handlePausePlay = () => {
    if (!videoRef.current || video.isLive) return;

    if (isPaused) {
      videoRef.current.play().then(() => {
        setIsPaused(false);
        setIsPlaying(true);
      }).catch(console.error);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleFollow = async () => {
    onVideoUpdate({
      ...video,
      shop: {
        ...video.shop,
        isFollowing: true,
        followers: video.shop.followers + 1,
      },
    });
  };

  const handleLike = () => {
    onVideoUpdate({
      ...video,
      isLiked: !video.isLiked,
      likes: video.isLiked ? video.likes - 1 : video.likes + 1,
    });
  };

  return (
    <div className="relative w-full h-full bg-white">

      {/* Mobile Layout */}
      <div className="md:hidden">
              {/* Video (93% height) */}
              <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                className="w-full h-[calc(100vh-64px)] md:h-[93vh] object-cover object-center"
                loop
                playsInline
                muted
                autoPlay
                onError={(e) => {
                  console.log('Video failed to load:', video.videoUrl);
                  // Could set a fallback video source here
                }}
              />

              {/* Pause/Play Overlay - Only for non-live videos */}
              {!video.isLive && (
                <button
                  onClick={handlePausePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {isPaused ? (
                      <Play className="w-8 h-8 text-white ml-1" />
                    ) : (
                      <Pause className="w-8 h-8 text-white" />
                    )}
                  </div>
                </button>
              )}

        {/* Mobile Floating Action Buttons - Inside Video */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
          {/* Shop Avatar with Follow Button */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="relative">
              <img
                src={video.shop.logo}
                alt={video.shop.name}
                className="w-10 h-10 rounded-full"
              />
              {!video.shop.isFollowing && (
                <button
                  onClick={() => {
                    // Follow functionality - for now just log, would be handled by parent
                    console.log('Follow shop:', video.shop.name);
                  }}
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white hover:scale-110 transition"
                >
                  <Plus className="w-2.5 h-2.5 text-white" />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1"
          >
            <Heart
              className={`w-8 h-8 ${video.isLiked ? "fill-red-500 text-red-500" : "text-white"} drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:scale-110 transition`}
            />
            <span className="text-xs font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {video.likes}
            </span>
          </button>

          <button
            onClick={() => setShowComments(true)}
            className="flex flex-col items-center gap-1"
          >
            <MessageCircle className="w-8 h-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:scale-110 transition" />
            <span className="text-xs font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {video.comments}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <Share2 className="w-8 h-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:scale-110 transition" />
            <span className="text-xs font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {video.shares}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <MoreVertical className="w-8 h-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:scale-110 transition" />
          </button>
        </div>



        {/* Comments Drawer */}
        {showComments && (
          <CommentDrawer
            videoId={video.id}
            commentCount={video.comments}
            onClose={() => setShowComments(false)}
          />
        )}
      </div>

      {/* Desktop/Tablet Layout - Adapted from Mobile */}
      <div className="hidden md:block">
        {/* Video (93% height) */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          className="w-full h-[93vh] object-cover object-center"
          loop
          playsInline
          muted
          autoPlay
          onError={(e) => {
            console.log('Video failed to load:', video.videoUrl);
            // Could set a fallback video source here
          }}
        />

        {/* Pause/Play Overlay - Only for non-live videos */}
        {!video.isLive && (
          <button
            onClick={handlePausePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {isPaused ? (
                <Play className="w-10 h-10 text-white ml-1" />
              ) : (
                <Pause className="w-10 h-10 text-white" />
              )}
            </div>
          </button>
        )}


        {/* Desktop Shop Info & Caption */}
        <div className="absolute bottom-4 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-4">
            <img
              src={video.shop.logo}
              alt={video.shop.name}
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold text-xl">{video.shop.name}</span>
                <button className="px-4 py-2 bg-transparent text-white text-sm font-medium border border-white rounded hover:bg-white hover:text-black transition">
                  Ikuti +
                </button>
              </div>
              <p className="text-white text-base line-clamp-2 mt-2">
                {video.title}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Drawer */}
        {showComments && (
          <CommentDrawer
            videoId={video.id}
            commentCount={video.comments}
            onClose={() => setShowComments(false)}
          />
        )}
      </div>

    </div>
  );
}