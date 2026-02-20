'use client';

import { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Store, StoreFilter, StoreSortOption, StoreProduct } from '@/types/store';
import { ChevronDown, Filter, Grid, List, ArrowUp, ArrowDown } from 'lucide-react';
import { formatPrice, formatRating } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import CategoryRankingProduct from './CategoryRankingProduct';
 
function ProductDivisionInner({ active, onChange }: { active: 'produk' | 'kategori'; onChange?: (v: 'produk' | 'kategori') => void }) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50; // px

  // Fixed/sticky fallback using JS measurement (works even if CSS sticky is broken by transforms/overflow)
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [fixedStyle, setFixedStyle] = useState<React.CSSProperties | undefined>(undefined);

  const updateFixedState = () => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const shouldFix = rect.top <= 0;
    if (shouldFix !== isFixed) {
      setIsFixed(shouldFix);
      if (placeholderRef.current) placeholderRef.current.style.height = shouldFix ? `${rect.height}px` : '0px';
    }
    if (shouldFix) {
      setFixedStyle({
        position: 'fixed',
        top: 0,
        left: rect.left,
        width: rect.width,
        zIndex: 20,
      });
    } else {
      setFixedStyle(undefined);
    }
  };

  useLayoutEffect(() => {
    updateFixedState();
  }, []);

  useEffect(() => {
    const onScrollOrResize = () => {
      updateFixedState();
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    onScrollOrResize();
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isFixed]);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      updateFixedState();
    });
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) < minSwipeDistance) return;
    if (distance > 0) {
      // swiped left -> go to 'produk'
      if (active !== 'produk') onChange?.('produk');
    } else {
      // swiped right -> go to 'kategori'
      if (active !== 'kategori') onChange?.('kategori');
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <div ref={placeholderRef} aria-hidden style={{ height: 0 }} />
      <div ref={wrapperRef} className="bg-white" style={fixedStyle}>
        <div
          className="flex border-b border-gray-200"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
        <button
          onClick={() => onChange?.('produk')}
          className={`flex-1 py-[1px] h-[50px] text-center transition-colors ${
            active === 'produk'
              ? 'text-gray-900 border-b-2 border-red-600 font-semibold'
              : 'text-gray-600/50'
          }`}
        >
          Produk
        </button>

        <button
          onClick={() => onChange?.('kategori')}
          className={`flex-1 py-[1px] h-[50px] text-center transition-colors ${
            active === 'kategori'
              ? 'text-gray-900 border-b-2 border-red-600 font-semibold'
              : 'text-gray-600/50'
          }`}
        >
          Kategori
        </button>
      </div>
      </div>
    </>
  );
}

interface MobileStoreProductsProps {
  store: Store;
  filters: StoreFilter;
  sortBy: StoreSortOption;
  onFiltersChange: (filters: StoreFilter) => void;
  onSortChange: (sort: StoreSortOption) => void;
  showDivision?: boolean;
}

const sortOptions: { value: StoreSortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'price-low-to-high', label: 'Price: Low to High' },
  { value: 'price-high-to-low', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'top-rated', label: 'Top Rated' },
];

export function MobileStoreProducts({
  store,
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  showDivision = true,
}: MobileStoreProductsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeDivision, setActiveDivision] = useState<'produk' | 'kategori'>('produk');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  const onTouchStart = (e: any) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    touchStartX.current = x;
  };

  const onTouchEnd = (e: any) => {
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    if (touchStartX.current === null) return;
    const delta = x - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD) {
      // swipe right -> go to 'produk'
      if (activeDivision === 'kategori') setActiveDivision('produk');
    } else if (delta < -SWIPE_THRESHOLD) {
      // swipe left -> go to 'kategori'
      if (activeDivision === 'produk') setActiveDivision('kategori');
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...store.products];

    // Apply filters
    const cats = filters.categories ?? [];
    if (cats.length) {
      products = products.filter((product) =>
        cats.some((cat) => product.category.toLowerCase().includes(cat.toLowerCase()))
      );
    }

    const priceRange = filters.priceRange;
    if (priceRange) {
      const hasMin = typeof priceRange.min === 'number';
      const hasMax = typeof priceRange.max === 'number';
      if (hasMin && hasMax) {
        products = products.filter((product) => product.price >= (priceRange.min as number) && product.price <= (priceRange.max as number));
      } else if (hasMin) {
        products = products.filter((product) => product.price >= (priceRange.min as number));
      } else if (hasMax) {
        products = products.filter((product) => product.price <= (priceRange.max as number));
      }
    }

    if (typeof filters.rating === 'number') {
      products = products.filter((product) => product.rating >= filters.rating!);
    }

    if (filters.discount) {
      products = products.filter((product) => product.discount && product.discount > 0);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low-to-high':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-to-low':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'top-rated':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming newer products have higher IDs for now
        products.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'best-selling':
        // Sort by sold count (mock data)
        products.sort((a, b) => {
          const aSoldStr = String(a.sold);
          const bSoldStr = String(b.sold);
          const aSold = parseInt(aSoldStr.replace(/[+,k]/g, '')) * (aSoldStr.includes('k') ? 1000 : 1);
          const bSold = parseInt(bSoldStr.replace(/[+,k]/g, '')) * (bSoldStr.includes('k') ? 1000 : 1);
          return bSold - aSold;
        });
        break;
      default: // 'recommended'
        // Keep original order
        break;
    }

    return products;
  }, [store.products, filters, sortBy]);

  // products to display when a category is selected in kategori pane
  const displayedProducts = useMemo(() => {
    if (!selectedCategory) return filteredProducts;
    return filteredProducts.filter((p) => String(p.category).toLowerCase() === String(selectedCategory).toLowerCase());
  }, [filteredProducts, selectedCategory]);

  const handleFilterClick = () => {
    // TODO: Open filter bottom sheet
    console.log('Open filter sheet');
  };

  return (
    <div className="bg-white">
      {/* Product division (Produk / Kategori) - only show when requested */}
      {showDivision && <ProductDivisionInner active={activeDivision} onChange={setActiveDivision} />}

      {/* Swipeable content: left = kategori, right = produk */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onPointerDown={onTouchStart}
        onPointerUp={onTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="overflow-hidden">
          <div
            className="flex"
            style={{
              width: '200%',
              transition: 'transform 320ms ease',
              transform: activeDivision === 'produk' ? 'translateX(0%)' : 'translateX(-50%)',
            }}
          >
            {/* Produk pane */}
            <div style={{ width: '50%' }} className="flex-1">
              {/* Toolbar (no bottom border, buttons wrap instead of horizontally scrolling) */}
              <div className="px-2.5 py-[5px] flex items-center justify-between">
                <div className="flex items-center gap-2 h-[30px] leading-[30px] flex-wrap">
                  <div className="flex items-center gap-2 h-[30px] leading-[30px]">
                    <button
                      onClick={() => onSortChange('recommended')}
                      className={cn(
                        'px-2 py-1 rounded-md text-xs font-light',
                        sortBy === 'recommended' ? 'text-red-600' : 'text-gray-700'
                      )}
                    >
                      Populer
                    </button>

                    <button
                      onClick={() => onSortChange('newest')}
                      className={cn(
                        'px-2 py-1 rounded-md text-xs font-light',
                        sortBy === 'newest' ? 'text-red-600' : 'text-gray-700'
                      )}
                    >
                      Terbaru
                    </button>

                    <button
                      onClick={() => onSortChange('best-selling')}
                      className={cn(
                        'px-2 py-1 rounded-md text-xs font-light',
                        sortBy === 'best-selling' ? 'text-red-600' : 'text-gray-700'
                      )}
                    >
                      Terlaris
                    </button>

                    <button
                      onClick={() => {
                        const next = sortBy === 'price-low-to-high' ? 'price-high-to-low' : 'price-low-to-high';
                        onSortChange(next as any);
                      }}
                      className={cn(
                        'px-2 py-1 rounded-md text-xs font-light inline-flex items-center',
                        (sortBy === 'price-low-to-high' || sortBy === 'price-high-to-low') ? 'text-red-600' : 'text-gray-700'
                      )}
                    >
                      <span>Harga</span>
                      {sortBy === 'price-high-to-low' && <ArrowDown className="w-3 h-3 ml-1 inline-block" />}
                      {sortBy === 'price-low-to-high' && <ArrowUp className="w-3 h-3 ml-1 inline-block" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="pt-0.5 px-4 pb-4">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <ProductListItem key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No products found matching your filters.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Kategori pane: left = categories, right = products for selected category */}
            <div style={{ width: '50%' }} className="pr-3 bg-gray-50">
              <div className="flex">
                {/* Left: category list */}
                <div className="w-[100px] border-r border-gray-100 pt-2 pb-2">
                  <div className="space-y-2">
                    {store.categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={cn(
                          'w-full text-left px-3 py-3 text-sm transition-colors',
                          selectedCategory === cat.name ? 'bg-white text-red-600 font-semibold' : 'text-gray-700'
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: products for selected category */}
                <div className="flex-1 pl-[5px] pb-0.5">
                  {viewMode === 'grid' ? (
                    // Use category-based layout for kategori pane (render component directly)
                    <CategoryRankingProduct category={selectedCategory} products={store.products} top={displayedProducts.length || 10} />
                  ) : (
                    <CategoryRankingProduct category={selectedCategory} products={store.products} top={displayedProducts.length || 10} />
                  )}

                  {displayedProducts.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No products found matching your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <Link href={`/product/${product.id}`} className="block w-full">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow w-full">
        <div className="w-full bg-gray-100 overflow-hidden rounded-t-lg">
          <div className="relative w-full h-48">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="50vw"
            />
            {/* Small corner badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1" style={{ zIndex: 40 }}>
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  New
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  Best Seller
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-2 min-w-0" style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>

                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-900">{formatRating(product.rating)}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">{product.sold} terjual</span>
                  </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="text-base font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span
                className="text-sm text-gray-500 line-through"
                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}
              >
                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(product.originalPrice)}
              </span>
            )}
          </div>

          
        </div>
      </div>
    </Link>
  );
}

function ProductListItem({ product }: { product: StoreProduct }) {
  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="flex gap-3 pl-0 pr-3 py-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviewCount})</span>
          </div>

          <div className="flex items-center gap-2 h-5 leading-5">
            <span className="text-base font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount && product.discount > 0 && (
              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}