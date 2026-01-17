'use client';

import { Product } from '@/types';
import { StickyHeader } from './StickyHeader';
import { InfiniteProductFeed } from '@/components/product';

interface CenterColumnFeedProps {
  products: Product[];
  onLoadMore: () => Promise<Product[]>;
  hasMore: boolean;
}

export function CenterColumnFeed({ products, onLoadMore, hasMore }: CenterColumnFeedProps) {
  return (
    <div className="h-screen overflow-y-auto bg-white">
      <StickyHeader />
      <div className="px-2 sm:px-4">
        <InfiniteProductFeed
          initialProducts={products}
          loadMore={onLoadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}