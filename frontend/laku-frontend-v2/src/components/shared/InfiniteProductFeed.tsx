'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/shared/ProductCard';
import { fetchMoreProductsAction } from '@/lib/actions';

interface InfiniteProductFeedProps {
  initialProducts: Product[];
  loadMore?: () => Promise<Product[]>;
  hasMore?: boolean;
}

export function InfiniteProductFeed({ initialProducts = [], hasMore = false }: InfiniteProductFeedProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(hasMore);
  const [offset, setOffset] = useState(initialProducts.length);

  const observerRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(async () => {
    if (loading || !canLoadMore) return;

    setLoading(true);
    try {
      const limit = 10;
      const newProducts = await fetchMoreProductsAction(offset, limit);
      if (!newProducts || newProducts.length === 0) {
        setCanLoadMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setOffset(prev => prev + newProducts.length);
      }
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, canLoadMore, offset]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && canLoadMore && !loading) {
          handleLoadMore();
        }
      },
      { rootMargin: '300px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [observerRef.current, canLoadMore, loading, handleLoadMore]);

  return (
    <div className="px-0 py-0">
      {/* Products Grid - Masonry layout with matching gaps as Explore section */}
      <div className="w-full">
        {/* Two-column flex masonry - matching Explore feed gap (1.5 = 3px) */}
        <div className="full-bleed">
          <div className="flex" style={{ columnGap: '3px', rowGap: '3px', padding: 0, margin: 0, width: '100%', boxSizing: 'border-box' }}>
          {/* Left column */}
          <div className="pl-1 pr-0.5 flex-1 flex flex-col" style={{ columnGap: '3px', rowGap: '7px' }}>
            {products.filter((_, i) => i % 2 === 0).map((product, idx) => (
              <div key={`${product.id}-left-${idx}`} style={{ width: '100%' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="pr-1 pl-0.5 flex-1 flex flex-col" style={{ columnGap: '3px', rowGap: '7px' }}>
            {products.filter((_, i) => i % 2 === 1).map((product, idx) => (
              <div key={`${product.id}-right-${idx}`} style={{ width: '100%' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* Intersection observer sentinel */}
      <div ref={observerRef} className="h-6" aria-hidden="true" />

      {/* Load More Button (fallback) */}
      {canLoadMore && (
        <div className="text-center py-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}

      {/* No More Products Message */}
      {!canLoadMore && products.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You&apos;ve seen all products
        </div>
      )}
    </div>
  );
}

export default InfiniteProductFeed;
