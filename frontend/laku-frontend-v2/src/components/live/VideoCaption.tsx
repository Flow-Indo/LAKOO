'use client';

import { useState } from 'react';
import { Music } from 'lucide-react';
import type { LiveVideo } from '@/types/live';

interface Props {
  video: LiveVideo;
}

export function VideoCaption({ video }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;
  const needsExpansion = video.caption.length > maxLength;

  return (
    <div className="absolute bottom-20 left-0 right-0 px-4 z-10 bg-transparent pt-8 pb-4">

      {/* Username */}
      <p className="text-white font-semibold mb-2">
        @{video.creator.username}
      </p>

      {/* Caption */}
      <p className="text-white text-sm mb-3">
        {isExpanded || !needsExpansion
          ? video.caption
          : `${video.caption.slice(0, maxLength)}...`}
        {needsExpansion && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 text-white/70 font-semibold"
          >
            {isExpanded ? 'less' : 'more'}
          </button>
        )}
      </p>

      {/* Audio Info */}
      <div className="flex items-center gap-2">
        <Music className="w-4 h-4 text-white" />
        <span className="text-white text-xs">
          {video.audio.artist} · {video.audio.name}
        </span>
      </div>

    </div>
  );
}