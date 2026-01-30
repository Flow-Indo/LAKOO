'use client';

import { useState } from 'react';
import { Store, StoreTab, StoreFilter, StoreSortOption } from '@/types/store';
import { MobileStoreHeader } from './MobileStoreHeader';
import { MobileStoreInfoCard } from './MobileStoreInfoCard';
import { MobileStoreBody } from './MobileStoreBody';
import { MobileStoreTabs } from './MobileStoreTabs';
import { MobileStoreProducts } from './MobileStoreProducts';
import { MobileStoreReviews } from './MobileStoreReviews';


interface MobileStorePageProps {
  store: Store;
  showBottomNav?: boolean;
}

export function MobileStorePage({ store, showBottomNav = true }: MobileStorePageProps) {
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

      {showBottomNav && (
        <MobileStoreTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          store={store}
        />
      )}

      {/* Tab Content */}
      <div className="pt-0 pb-0"> {/* padding reset per preview changes */}
        {activeTab === 'home' && (
          <>
            <MobileStoreInfoCard store={store} />
            <MobileStoreBody />
            <MobileStoreProducts
              store={store}
              filters={filters}
              sortBy={sortBy}
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
              showDivision={false}
            />
          </>
        )}

        {activeTab === 'products' && (
          <>
            <MobileStoreInfoCard store={store} />
          <MobileStoreProducts
            store={store}
            filters={filters}
            sortBy={sortBy}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
          />
          </>
        )}

        {activeTab === 'reviews' && (
          <MobileStoreReviews store={store} />
        )}

        {activeTab === 'chat' && (
          <div className="p-4 text-center text-gray-600">Chat room coming soon</div>
        )}
      </div>
    </div>
  );
}