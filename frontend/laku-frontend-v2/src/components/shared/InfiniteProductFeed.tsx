'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { Heart, ShoppingCart } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';

interface InfiniteProductFeedProps {
  initialProducts: Product[];
  loadMore: () => Promise<Product[]>;
  hasMore: boolean;
}

export function InfiniteProductFeed({ initialProducts, loadMore, hasMore }: InfiniteProductFeedProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(hasMore);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = async () => {
    if (loading || !canLoadMore) return;

    setLoading(true);
    try {
      const newProducts = await loadMore();
      if (!newProducts || newProducts.length === 0) {
        setCanLoadMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoading(false);
    }
  };

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
  }, [observerRef.current, canLoadMore, loading]);

  return (
    <div className="space-y-6">
      {/* Products Grid - FIXED 2 equal columns, card widths controlled by grid */}
      <div className="w-full px-0">
        {/* Two-column flex "masonry" - stable, scroll-friendly */}
        <div className="full-bleed">
          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '0',
              margin: 0,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
          {/* Left column */}
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.filter((_, i) => i % 2 === 0).map((product, idx) => (
              <div key={`${product.id}-left-${idx}`} style={{ width: '100%' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          You've seen all products
        </div>
      )}
    </div>
  );
}