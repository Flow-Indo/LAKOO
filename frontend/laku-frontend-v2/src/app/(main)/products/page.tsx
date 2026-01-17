'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layouts';
import { CenterColumnFeed } from '@/components/layouts/center-column';
import { ProductFilters } from '@/components/layouts/sidebars';
import { MOCK_PRODUCTS, fetchMoreProducts } from '@/lib/mock-data';

export default function ProductsPage() {
  // Start with first 20 products for infinite scroll
  const initialProducts = MOCK_PRODUCTS.slice(0, 20);
  const [hasMore, setHasMore] = useState(true);
  const [loadCount, setLoadCount] = useState(0);

  const onLoadMore = async () => {
    try {
      const newProducts = await fetchMoreProducts(initialProducts.length + (loadCount * 20), 20);
      setLoadCount(prev => prev + 1);

      // Stop loading after 3 batches (60 total products)
      if (loadCount >= 2) {
        setHasMore(false);
      }

      return newProducts;
    } catch (error) {
      console.error('Error loading more products:', error);
      setHasMore(false);
      return [];
    }
  };

  return (
    <AppLayout
      rightSidebarContent={<ProductFilters />}
    >
      <CenterColumnFeed
        products={initialProducts}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
      />
    </AppLayout>
  );
}