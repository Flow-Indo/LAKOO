'use client';

import { CenterColumnFeed } from '@/components/layouts/center-column';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Product } from '@/types';

interface HomePageClientProps {
  initialProducts: Product[];
}

export function HomePageClient({ initialProducts }: HomePageClientProps) {
  // Use initial products from server, fallback to mock data
  const products = initialProducts.length > 0 ? initialProducts : MOCK_PRODUCTS.slice(0, 20);

  return (
    <div className="pt-6 pb-24">
      <CenterColumnFeed
        products={products}
        hasMore={true}
      />
    </div>
  );
}