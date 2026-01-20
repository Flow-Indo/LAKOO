'use client';

import { Store, StoreTab } from '@/types/store';
import { cn } from '@/lib/utils';

interface MobileStoreTabsProps {
  activeTab: StoreTab;
  onTabChange: (tab: StoreTab) => void;
  store: Store;
}

const tabs: { id: StoreTab; label: string; getCount?: (store: Store) => number | undefined }[] = [
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'reviews', label: 'Reviews', getCount: (store) => store.reviews.length },
  { id: 'about', label: 'About' },
  { id: 'recommend', label: 'Recommend' },
];

export function MobileStoreTabs({ activeTab, onTabChange, store }: MobileStoreTabsProps) {
  return (
    <div className="sticky top-[73px] z-30 bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto scrollbar-hide px-4">
        {tabs.map((tab) => {
          const count = tab.getCount?.(store);
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors relative",
                isActive
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <span>{tab.label}</span>
              {count !== undefined && (
                <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}