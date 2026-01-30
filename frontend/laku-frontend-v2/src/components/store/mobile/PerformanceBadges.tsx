'use client';

import React from 'react';
import { StoreBadge } from '@/types/store';

function renderBadgeText(text: string) {
  // split but keep numbers
  const parts = text.split(/(\d+[A-Za-z+%]*)/g);

  return parts.map((part, idx) => {
    const isNumber = /^\d/.test(part);

    return (
      <span
        key={idx}
        className={isNumber ? 'text-red-600 font-medium' : 'text-black-600'}
      >
        {part}
      </span>
    );
  });
}

export function PerformanceBadges({ badges }: { badges: StoreBadge[] }) {
  return (
      <div className="relative mt-[7px] mb-[7px] w-full overflow-hidden">
        <div
          className="inline-flex mt-[5px] items-center gap-2 whitespace-nowrap min-w-max"
          style={{ animation: 'marquee 30s linear infinite', willChange: 'transform', marginTop: '7px' }}
        >
          {badges.map((badge) => (
            <span
              key={badge.id}
              className="px-2 py-1 bg-gray-50 text-xs rounded font-light inline-flex"
            >
              {renderBadgeText(badge.name)}
            </span>
          ))}

          {/* duplicated for marquee */}
          {badges.map((badge) => (
            <span
              aria-hidden="true"
              key={`dup-${badge.id}`}
              className="px-2 py-1 bg-gray-50 text-xs rounded font-light inline-flex"
            >
              {renderBadgeText(badge.name)}
            </span>
          ))}
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .inline-flex > span {
            display: inline-flex;
            align-items: center;
          }
          .inline-flex:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
  );
}
