'use client';

import { Volume2, VolumeX } from 'lucide-react';

interface Props {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  onToggleMute: () => void;
}

export function VideoControls({ isPlaying, isMuted, progress, onToggleMute }: Props) {
  return (
    <>
      {/* Mute Toggle */}
      <button
        onClick={onToggleMute}
        className="absolute bottom-32 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition border border-white/20"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
        <div
          className="h-full bg-white/70 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}