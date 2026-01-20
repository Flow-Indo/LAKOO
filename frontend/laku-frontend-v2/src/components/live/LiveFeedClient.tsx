'use client';

import { useState, useRef, useEffect } from 'react';
import { VideoPlayer } from './VideoPlayer';
import type { LiveVideo } from '@/types/live';

interface Props {
  initialVideos: LiveVideo[];
}

export function LiveFeedClient({ initialVideos }: Props) {
  const [videos, setVideos] = useState<LiveVideo[]>(initialVideos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll - load more videos
  const loadMoreVideos = async () => {
    if (isLoading) return;

    setIsLoading(true);
    // TODO: Fetch next batch of videos
    const newVideos = await fetch(`/api/live/feed?offset=${videos.length}`)
      .then(r => r.json())
      .catch(() => []);

    setVideos([...videos, ...newVideos]);
    setIsLoading(false);
  };

  // Detect when near end of videos
  useEffect(() => {
    if (currentIndex >= videos.length - 2) {
      loadMoreVideos();
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentIndex < videos.length - 1) {
        setCurrentIndex(currentIndex + 1);
        containerRef.current?.children[currentIndex + 1]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        containerRef.current?.children[currentIndex - 1]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length]);

  // Scroll snap detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="h-screen snap-start snap-always"
        >
          <VideoPlayer
            video={video}
            isActive={index === currentIndex}
            onVideoUpdate={(updatedVideo) => {
              setVideos(videos.map((v, i) =>
                i === index ? updatedVideo : v
              ));
            }}
          />
        </div>
      ))}

      {isLoading && (
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
        </div>
      )}
    </div>
  );
}