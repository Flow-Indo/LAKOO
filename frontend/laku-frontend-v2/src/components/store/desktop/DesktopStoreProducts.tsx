'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Store, StoreFilter, StoreSortOption, StoreProduct } from '@/types/store';
import { ChevronDown, Grid, List } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface DesktopStoreProductsProps {
  store: Store;
  filters: StoreFilter;
  sortBy: StoreSortOption;
  onFiltersChange: (filters: StoreFilter) => void;
  onSortChange: (sort: StoreSortOption) => void;
}

const sortOptions: { value: StoreSortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'price-low-to-high', label: 'Price: Low to High' },
  { value: 'price-high-to-low', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'top-rated', label: 'Top Rated' },
];

export function DesktopStoreProducts({
  store,
  filters,
  sortBy,
  onSortChange
}: DesktopStoreProductsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...store.products];

    // Apply filters
    if (filters.categories?.length) {
      products = products.filter(product =>
        filters.categories!.some(cat => product.category.toLowerCase().includes(cat.toLowerCase()))
      );
    }

    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      products = products.filter(product => {
        const meetsMin = min === undefined || product.price >= min;
        const meetsMax = max === undefined || product.price <= max;
        return meetsMin && meetsMax;
      });
    }

    if (filters.rating) {
      products = products.filter(product => product.rating >= filters.rating!);
    }

    if (filters.discount) {
      products = products.filter(product => product.discount && product.discount > 0);
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
        products.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'best-selling':
        products.sort((a, b) => {
          const aSold = parseInt(a.sold.replace(/[+,k]/g, '')) * (a.sold.includes('k') ? 1000 : 1);
          const bSold = parseInt(b.sold.replace(/[+,k]/g, '')) * (b.sold.includes('k') ? 1000 : 1);
          return bSold - aSold;
        });
        break;
      default: // 'recommended'
        break;
    }

    return products;
  }, [store.products, filters, sortBy]);

  return (
    <div className="flex-1">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Showing {filteredProducts.length} of {store.products.length} products
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span>{sortOptions.find(option => option.value === sortBy)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showSortDropdown && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg",
                        sortBy === option.value ? "bg-red-50 text-red-600 font-medium" : "text-gray-700"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-l-lg transition-colors",
                  viewMode === 'grid' ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-r-lg transition-colors",
                  viewMode === 'list' ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-8">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found matching your filters.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.discount && product.discount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                -{product.discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
                Best Seller
              </span>
            )}
          </div>

          {/* Shipping badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {product.shipping.free && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
                Free Ship
              </span>
            )}
            {product.shipping.express && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                Express
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{product.sold} sold</span>
            <span className="capitalize">{product.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProductListItem({ product }: { product: StoreProduct }) {
  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="flex gap-6 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>

            {/* Badges */}
            <div className="flex gap-2 ml-4">
              {product.discount && product.discount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                  -{product.discount}%
                </span>
              )}
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                  New
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <span className="text-sm text-gray-500 capitalize">{product.category}</span>
            <span className="text-sm text-gray-600">{product.sold} sold</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {product.shipping.free && (
              <span className="text-sm text-green-600 font-medium">Free Shipping</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}