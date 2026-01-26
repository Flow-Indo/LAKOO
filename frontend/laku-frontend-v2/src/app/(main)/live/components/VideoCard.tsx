 'use client';
 
 import React, { useRef, useState, useEffect } from 'react';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { LiveVideo } from '../mockData';
 import { TabsOverlay } from './TabsOverlay';
 import { CreatorProfile } from './CreatorProfile';
 import { ActionButtons } from './ActionButtons';
 import { ProductCard } from './ProductCard';
 
 const FALLBACK_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-clothing-in-a-urban-setting-4687-large.mp4';
 
 type Props = {
   video: LiveVideo;
 };
 
export function VideoCard({ video }: Props) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [shouldLoad, setShouldLoad] = useState<boolean>(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = videoRef.current;
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setShouldLoad(true);
            if (v) {
              v.muted = true;
              v.play().catch(() => {});
              setIsPlaying(true);
            }
          } else {
            if (v) {
              v.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: [0.5, 0.75, 1] }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const src = video.videoUrl || FALLBACK_VIDEO;
  const poster = video.thumbnail || video.creator?.avatar || '';

  const handleError = () => {
    const v = videoRef.current;
    if (v && v.src !== FALLBACK_VIDEO) {
      v.src = FALLBACK_VIDEO;
      v.load();
      v.play().catch(() => {});
    }
  };

  return (
    <div ref={containerRef} className="relative h-screen w-full snap-start bg-black">
      {/* Video (background) */}
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        poster={poster}
        className="w-full h-full object-cover"
        playsInline
        autoPlay
        muted
        loop
        onClick={togglePlay}
        onError={handleError}
        preload="metadata"
        controls={false}
      />

      {/* Gradients (below overlays) */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-30" />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-30" />

      {/* Overlays */}
      <TabsOverlay />
      <ActionButtons likes={video.likes} onLike={() => {}} onComment={() => {}} onGift={() => {}} onShare={() => {}} />
      <CreatorProfile name={video.creator.name} avatar={video.creator.avatar} />
      <ProductCard product={video.featuredProduct} />
    </div>
  );
}

