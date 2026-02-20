'use client';

import { useRef, useState, useEffect } from 'react';
import { VideoOverlay } from './VideoOverlay';
import { ActionBar } from './ActionBar';
import { VideoCaption } from './VideoCaption';
import { VideoControls } from './VideoControls';
import { CommentDrawer } from './CommentDrawer';
import type { LiveVideo } from '@/types/live';

interface Props {
  video: LiveVideo;
  isActive: boolean;
  onVideoUpdate: (video: LiveVideo) => void;
}

export function VideoPlayer({ video, isActive, onVideoUpdate }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-play when active
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  // Update progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, []);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleDoubleTap = () => {
    // Double tap to like
    if (!video.isLiked) {
      onVideoUpdate({
        ...video,
        isLiked: true,
        likes: video.likes + 1,
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-black">

      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        className="w-full h-full object-contain"
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlayPause}
        onDoubleClick={handleDoubleTap}
      />

      {/* Top Overlay - User Info */}
      <VideoOverlay video={video} onVideoUpdate={onVideoUpdate} />

      {/* Right Side - Action Bar */}
      <ActionBar
        video={video}
        onVideoUpdate={onVideoUpdate}
        onCommentClick={() => setShowComments(true)}
      />

      {/* Bottom - Caption */}
      <VideoCaption video={video} />

      {/* Video Controls */}
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        progress={progress}
        onToggleMute={toggleMute}
      />

      {/* Comments Drawer */}
      {showComments && (
        <CommentDrawer
          videoId={video.id}
          commentCount={video.comments}
          onClose={() => setShowComments(false)}
        />
      )}

    </div>
  );
}