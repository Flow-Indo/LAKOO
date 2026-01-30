'use client';

import { Store, StoreTab } from '@/types/store';
import { cn } from '@/lib/utils';

interface MobileStoreTabsProps {
  activeTab: StoreTab;
  onTabChange: (tab: StoreTab) => void;
  store: Store;
}

const tabs: { id: StoreTab; label: string; getCount?: (store: Store) => number | undefined }[] = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'reviews', label: 'Reviews', getCount: (store) => store.reviews.length },
  { id: 'chat', label: 'Chat' },
];

export function MobileStoreTabs({ activeTab, onTabChange, store }: MobileStoreTabsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 pb-safe-bottom">
      <div className="flex w-full overflow-hidden">
        {tabs.map((tab) => {
          const count = tab.getCount?.(store);
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 text-center py-3 text-sm font-medium transition-colors relative",
                isActive
                  ? "text-orange-600"
                  : "text-black-600"
              )}
            >
              <span className="inline-flex items-center justify-center">
              <span>{tab.label}</span>
              {count !== undefined && (
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                  {count}
                </span>
              )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}