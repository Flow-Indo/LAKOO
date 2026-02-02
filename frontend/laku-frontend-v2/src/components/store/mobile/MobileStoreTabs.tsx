'use client';

import { Store, StoreTab } from '@/types/store';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MobileStoreTabsProps {
  activeTab: StoreTab;
  onTabChange: (tab: StoreTab) => void;
  store: Store;
}

const tabs: { id: StoreTab; label: string; getCount?: (store: Store) => number | undefined }[] = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'tags', label: 'Tags', getCount: (store) => undefined },
  { id: 'chat', label: 'Chat' },
];

export function MobileStoreTabs({ activeTab, onTabChange, store }: MobileStoreTabsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 pb-safe-bottom">
      <div className="flex w-full overflow-hidden h-16">
        {tabs.map((tab) => {
          const count = tab.getCount?.(store);
          const isActive = activeTab === tab.id;
          if (tab.id === 'chat') {
            return (
              <Link
                key={tab.id}
                href={'http://localhost:3000/messages'}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex-1 text-center h-full text-sm font-medium transition-colors relative",
                  isActive ? "text-red-600" : "text-gray-600"
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
              </Link>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 text-center h-full text-sm font-medium transition-colors relative",
                isActive ? "text-red-600" : "text-gray-600"
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