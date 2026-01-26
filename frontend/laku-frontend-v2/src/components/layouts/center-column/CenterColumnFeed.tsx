'use client';

import { Product } from '@/types';
import { StickyHeader } from './StickyHeader';
import { InfiniteProductFeed } from '@/components/shared/InfiniteProductFeed';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

interface CenterColumnFeedProps {
  products: Product[];
  hasMore: boolean;
}

export function CenterColumnFeed({ products, hasMore }: CenterColumnFeedProps) {
  const onLoadMore = async () => {
    // Simulate API call - TODO: Replace with real API
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_PRODUCTS.slice(0, 20); // Return more products
  };

  return (
    <div className="min-h-full bg-white">
      <StickyHeader />
      <div className="px-6 md:px-8 lg:px-12 xl:px-16">
        <InfiniteProductFeed
          initialProducts={products}
          loadMore={onLoadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}