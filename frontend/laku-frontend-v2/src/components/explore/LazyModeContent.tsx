'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic imports with loading states - code splitting for performance
const ForYouFeed = dynamic(() => import('./feeds/ForYouFeed'), {
  loading: () => <FeedSkeleton />,
  ssr: false,
});

const VideoFeed = dynamic(() => import('./feeds/VideoFeed'), {
  loading: () => <FeedSkeleton />,
  ssr: false,
});

const LiveFeed = dynamic(() => import('./feeds/LiveFeed'), {
  loading: () => <FeedSkeleton />,
  ssr: false,
});

const NearbyFeed = dynamic(() => import('./feeds/NearbyFeed'), {
  loading: () => <FeedSkeleton />,
  ssr: false,
});

const SeriesFeed = dynamic(() => import('./feeds/SeriesFeed'), {
  loading: () => <FeedSkeleton />,
  ssr: false,
});

const TravelFeed = dynamic(() => import('./feeds/TravelFeed'), {
  loading: () => <FeedSkeleton />,
  ssr: false,
});

function FeedSkeleton() {
  return (
    <div className="px-1 py-1.5">
      <div 
        className="grid grid-cols-2 gap-1.5"
        style={{
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-md aspect-[3/4] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function LazyModeContent({ mode }: { mode: string }) {
  switch (mode) {
    case 'foryou':
      return (
        <Suspense fallback={<FeedSkeleton />}>
          <ForYouFeed />
        </Suspense>
      );
    case 'video':
      return (
        <Suspense fallback={<FeedSkeleton />}>
          <VideoFeed />
        </Suspense>
      );
    case 'live':
      return (
        <Suspense fallback={<FeedSkeleton />}>
          <LiveFeed />
        </Suspense>
      );
    case 'nearby':
      return (
        <Suspense fallback={<FeedSkeleton />}>
          <NearbyFeed />
        </Suspense>
      );
    case 'series':
      return (
        <Suspense fallback={<FeedSkeleton />}>
          <SeriesFeed />
        </Suspense>
      );
    case 'travel':
      return (
        <Suspense fallback={<FeedSkeleton />}>
          <TravelFeed />
        </Suspense>
      );
    default:
      return <FeedSkeleton />;
  }
}

export default LazyModeContent;
