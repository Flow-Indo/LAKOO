'use client';

import { useState } from 'react';
import { Store, StoreTab, StoreFilter, StoreSortOption } from '@/types/store';

import { MobileStoreBody } from './MobileStoreBody';
import { MobileStoreTabs } from './MobileStoreTabs';
import { MobileStoreProducts } from './MobileStoreProducts';
import MobileStoreTags from './MobileStoreTags';
import { MobileStoreBioBackground } from './MobileStoreBioBackground';
import { MobileStoreBioName } from './MobileStoreBioName';
import { MobileStoreBioCaption } from './MobileStoreBioCaption';
import MobileStoreProductsTagsHeader from './MobileStoreProductsTagsHeader';


interface MobileStorePageProps {
  store: Store;
  showBottomNav?: boolean;
}

export function MobileStorePage({ store, showBottomNav = true }: MobileStorePageProps) {
  const [activeTab, setActiveTab] = useState<StoreTab>('products');
  const [filters, setFilters] = useState<StoreFilter>({});
  const [sortBy, setSortBy] = useState<StoreSortOption>('recommended');
  const [isFollowing, setIsFollowing] = useState<boolean>(!!store.isFollowing);

  const toggleFollow = () => {
    setIsFollowing((s) => !s);
  };

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

      {showBottomNav && (
        <MobileStoreTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          store={store}
        />
      )}
      {/* Sticky header for selected tabs - placed above tab content to avoid ancestor overflow */}
      {(['home', 'products', 'tags'] as StoreTab[]).includes(activeTab) && (
        <>
          {activeTab === 'home' ? (
            <MobileStoreBioBackground store={store} expandedHeight={300}>
              <MobileStoreBioName store={store} />
              <MobileStoreBioCaption store={store} isFollowing={isFollowing} onFollow={toggleFollow} />
            </MobileStoreBioBackground>
          ) : (
            <MobileStoreProductsTagsHeader store={store} expandedHeight={130} isFollowing={isFollowing} onFollow={toggleFollow} />
          )}
        </>
      )}

      {/* Tab Content */}
      <div className="pt-0 pb-0"> {/* padding reset per preview changes */}

        {activeTab === 'home' && (
          <>
            <MobileStoreBody store={store} images={store.products.map((p) => p.image)} />
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
          <MobileStoreProducts
            store={store}
            filters={filters}
            sortBy={sortBy}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
          />
          </>
        )}

        {activeTab === 'tags' && (
          <MobileStoreTags store={store} />
        )}

        {activeTab === 'chat' && (
          <div className="p-4 text-center text-gray-600">Chat room coming soon</div>
        )}
      </div>
    </div>
  );
}