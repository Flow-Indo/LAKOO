'use client';

import { useState } from 'react';
import { Store, StoreTab, StoreFilter, StoreSortOption } from '@/types/store';
import { MobileStoreHeader } from './MobileStoreHeader';
import { MobileStoreBanner } from './MobileStoreBanner';
import { MobileStoreInfoCard } from './MobileStoreInfoCard';
import { MobileStoreTabs } from './MobileStoreTabs';
import { MobileStoreProducts } from './MobileStoreProducts';
import { MobileStoreCategories } from './MobileStoreCategories';
import { MobileStoreReviews } from './MobileStoreReviews';
import { MobileStoreAbout } from './MobileStoreAbout';
import { MobileStoreRecommend } from './MobileStoreRecommend';

interface MobileStorePageProps {
  store: Store;
}

export function MobileStorePage({ store }: MobileStorePageProps) {
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
      <MobileStoreHeader store={store} />
      <MobileStoreBanner store={store} />
      <MobileStoreInfoCard store={store} />

      <MobileStoreTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        store={store}
      />

      {/* Tab Content */}
      <div className="pb-20"> {/* Add padding bottom for mobile nav */}
        {activeTab === 'products' && (
          <MobileStoreProducts
            store={store}
            filters={filters}
            sortBy={sortBy}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
          />
        )}

        {activeTab === 'categories' && (
          <MobileStoreCategories store={store} />
        )}

        {activeTab === 'reviews' && (
          <MobileStoreReviews store={store} />
        )}

        {activeTab === 'about' && (
          <MobileStoreAbout store={store} />
        )}

        {activeTab === 'recommend' && (
          <MobileStoreRecommend store={store} />
        )}
      </div>
    </div>
  );
}