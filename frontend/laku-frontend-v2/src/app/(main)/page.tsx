'use client';

import { CenterColumnFeed } from '@/components/layouts/center-column';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function HomePage() {
  return (
    <CenterColumnFeed
      products={MOCK_PRODUCTS}
      onLoadMore={async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return MOCK_PRODUCTS.slice(0, 20); // Return more products
      }}
      hasMore={true}
    />
  );
}