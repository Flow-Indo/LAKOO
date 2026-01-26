'use client';

import { useState, useEffect } from 'react';
import { CenterColumnFeed } from '@/components/layouts/center-column';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Product } from '@/types';

interface HomePageClientProps {
  initialProducts: Product[];
}

export function HomePageClient({ initialProducts }: HomePageClientProps) {
  // Initialize with server-provided products so server and client markup match during hydration.
  // Apply the mock fallback only after mount to avoid hydration mismatches.
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    if (products.length === 0 && initialProducts.length === 0) {
      setProducts(MOCK_PRODUCTS.slice(0, 20));
    }
    // We intentionally run this only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-6 pb-24">
      <CenterColumnFeed
        products={products}
        hasMore={true}
      />
    </div>
  );
}