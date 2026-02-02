'use client';

import React from 'react';

interface Props {
  isFollowing?: boolean;
  onToggle?: () => void;
  className?: string;
}

export default function MobileStoreFollowing({ isFollowing, onToggle, className = '' }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={isFollowing}
      className={`px-4 h-[27px] rounded-full font-medium transition-colors text-white ${className}`}
      style={{ backgroundColor: isFollowing ? '#373737' : '#fe223c' }}
    >
      <span className="text-xs">{isFollowing ? 'Following' : 'Follow'}</span>
    </button>
  );
}

