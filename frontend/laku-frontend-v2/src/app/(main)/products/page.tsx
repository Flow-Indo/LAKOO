import { AppLayout } from '@/components/layouts';
import { CenterColumnFeed } from '@/components/layouts/center-column';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import React, { Suspense } from 'react';
import ProductGridSkeleton from '@/components/product/ProductGridSkeleton';

interface ProductsPageProps {
  searchParams?: Record<string, string | string[]>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Server-side: fetch or compute initial product list using searchParams for filters/sort
  // For now use mock data; replace with real fetch later.
  const allProducts = MOCK_PRODUCTS;

  // TODO: apply server-side filtering/sorting using searchParams
  const initialProducts = allProducts.slice(0, 20);
  const hasMore = allProducts.length > initialProducts.length;

  return (
    <AppLayout>
      <Suspense fallback={<ProductGridSkeleton />}>
        <CenterColumnFeed products={initialProducts} hasMore={hasMore} />
      </Suspense>
    </AppLayout>
  );
}