'use client';

import { useState } from 'react';
import { Store, StoreTab, StoreFilter, StoreSortOption } from '@/types/store';
import { DesktopStoreBanner } from './DesktopStoreBanner';
import { DesktopStoreInfoBar } from './DesktopStoreInfoBar';
import { DesktopStoreNavigation } from './DesktopStoreNavigation';
import { DesktopStoreFilters } from './DesktopStoreFilters';
import { DesktopStoreProducts } from './DesktopStoreProducts';

interface DesktopStorePageProps {
  store: Store;
}

export function DesktopStorePage({ store }: DesktopStorePageProps) {
  const [activeTab, setActiveTab] = useState<StoreTab>('products');
  const [filters, setFilters] = useState<StoreFilter>({});
  const [sortBy, setSortBy] = useState<StoreSortOption>('recommended');

  const handleTabChange = (tab: StoreTab) => {
    setActiveTab(tab);
  };

  const handleFiltersChange = (newFilters: StoreFilter) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: StoreSortOption) => {
    setSortBy(newSort);
  };

  return (
    <div className="min-h-screen bg-white">
      <DesktopStoreBanner store={store} />
      <DesktopStoreInfoBar store={store} />
      <DesktopStoreNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        store={store}
      />

      <div className="flex">
        {/* Left Sidebar - Filters */}
        <DesktopStoreFilters
          store={store}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'products' && (
            <DesktopStoreProducts
              store={store}
              filters={filters}
              sortBy={sortBy}
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
            />
          )}

          {activeTab === 'categories' && (
            <DesktopStoreCategories store={store} />
          )}

          {activeTab === 'tags' && (
            <DesktopStoreReviews store={store} />
          )}

          {activeTab === 'about' && (
            <DesktopStoreAbout store={store} />
          )}

          {activeTab === 'recommend' && (
            <DesktopStoreRecommend store={store} />
          )}
        </div>
      </div>
    </div>
  );
}

// Placeholder components for other tabs
function DesktopStoreCategories({ store }: { store: Store }) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <div className="grid grid-cols-3 gap-6">
        {store.categories.map((category) => (
          <div key={category.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-600">{category.productCount} products</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopStoreReviews({ store }: { store: Store }) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="max-w-4xl">
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{store.rating}</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-6 h-6 ${i < Math.floor(store.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600">{store.reviews.length} reviews</p>
          </div>
        </div>
        <div className="space-y-4">
          {store.reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <img src={review.user.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(review.user.name)}`} alt={review.user.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.user.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopStoreAbout({ store }: { store: Store }) {
  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">About {store.name}</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Store Information</h3>
            <div className="space-y-3">
              <p><strong>Location:</strong> {store.location}</p>
              <p><strong>Since:</strong> {store.joinedDate.getFullYear()}</p>
              <p><strong>Products:</strong> {store.productCount.toLocaleString()}</p>
              <p><strong>Followers:</strong> {(store.followers / 1000).toFixed(0)}K</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{store.performance.responseRate}%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{store.performance.shipOnTimeRate}%</div>
                <div className="text-sm text-gray-600">On-Time</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Description</h3>
          <p className="text-gray-700 leading-relaxed">{store.description}</p>
        </div>
      </div>
    </div>
  );
}

function DesktopStoreRecommend({ store }: { store: Store }) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Recommended</h2>
      <div className="grid grid-cols-4 gap-6">
        {store.products.slice(0, 8).map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-square bg-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-red-600 font-bold">Rp {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-gray-500 text-sm line-through">Rp {product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <div className="text-sm text-gray-600">{product.sold} sold</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}