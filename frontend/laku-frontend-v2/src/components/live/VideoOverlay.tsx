'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import type { LiveVideo } from '@/types/live';

interface Props {
  video: LiveVideo;
  onVideoUpdate: (video: LiveVideo) => void;
}

export function VideoOverlay({ video, onVideoUpdate }: Props) {
  const handleFollow = async () => {
    // TODO: API call to follow user
    onVideoUpdate({
      ...video,
      creator: {
        ...video.creator,
        isFollowing: true,
      },
    });
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-black/50 to-transparent">

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition"
        >
          <X className="w-5 h-5 text-white" />
        </Link>
      </div>

      <div className="flex items-center gap-3 ml-14">

        {/* Avatar */}
        <Image
          src={video.creator.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(video.creator.username)}`}
          alt={video.creator.displayName}
          width={40}
          height={40}
          className="rounded-full border-2 border-white"
        />

        {/* Username */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">
              {video.creator.username}
            </span>
            {video.creator.isVerified && (
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Follow Button */}
        {!video.creator.isFollowing && (
          <button
            onClick={handleFollow}
            className="px-6 py-1.5 rounded-lg font-semibold text-sm border-2 border-white text-white hover:bg-white hover:text-black transition"
          >
            Follow
          </button>
        )}

      </div>
    </div>
  );
}