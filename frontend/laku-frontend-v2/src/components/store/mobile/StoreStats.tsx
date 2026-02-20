 'use client';

import { Store } from '@/types/store';
import { Users } from 'lucide-react';

export function StoreStats({ store }: { store: Store }) {
  return (
    <div>
      <div className="flex flex-col text-xs text-white" style={{ marginTop: '3px', marginBottom: '3px' }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => {
              const fullStars = Math.floor(store.rating);
              const fraction = Math.max(0, Math.min(1, store.rating - fullStars));
              let fillPercent = 0;
              if (i < fullStars) fillPercent = 100;
              else if (i === fullStars) fillPercent = Math.round(fraction * 100);
              const clipId = `starClip-${i}-${Math.round(store.rating * 100)}`;
              // star path (material-style)
              const path =
                'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';
              return (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" className="inline-block">
                  <defs>
                    <clipPath id={clipId}>
                      <rect x="0" y="0" width={`${fillPercent}%`} height="100%" />
                    </clipPath>
                  </defs>
                  <path d={path} fill="#e5e7eb" />
                  <path d={path} fill="#f59e0b" clipPath={`url(#${clipId})`} />
                </svg>
              );
            })}
          </div>
        </div>

        {/* followers line removed as requested */}
      </div>
    </div>
  );
}

