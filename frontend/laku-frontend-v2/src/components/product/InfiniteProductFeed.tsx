'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '@/types';
import { ResponsiveProductGrid } from './ResponsiveProductGrid';

interface InfiniteProductFeedProps {
  initialProducts: Product[];
  loadMore: () => Promise<Product[]>;
  hasMore: boolean;
}

function LoadingSkeleton() {
  // Create 10 skeleton products for loading state
  const skeletonProducts: Product[] = Array.from({ length: 10 }, (_, index) => ({
    id: `skeleton-${index}`,
    name: '',
    slug: '',
    price: 0,
    image: '',
    category: '',
    description: '',
    stock: 0,
    store: {
      id: '',
      name: '',
      location: '',
    },
  }));

  return (
    <div className="opacity-60 pointer-events-none">
      <ResponsiveProductGrid products={skeletonProducts} />
    </div>
  );
}

export function InfiniteProductFeed({
  initialProducts,
  loadMore,
  hasMore
}: InfiniteProductFeedProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement>(null);

  // Load more products using the provided loadMore function
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const newProducts = await loadMore();
      setProducts(prev => [...prev, ...newProducts]);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMoreProducts();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before the trigger becomes visible
        threshold: 0.1,
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreProducts, hasMore, isLoading]);

  return (
    <div className="space-y-8">
      {/* Product Grid */}
      <ResponsiveProductGrid products={products} />

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <LoadingSkeleton />
        </div>
      )}

      {/* End of Feed Message */}
      {!hasMore && products.length > initialProducts.length && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Anda sudah sampai akhir
          </p>
        </div>
      )}

      {/* Intersection Observer Trigger */}
      <div
        ref={observerRef}
        className="h-10 flex items-center justify-center"
        aria-hidden="true"
      />
    </div>
  );
}