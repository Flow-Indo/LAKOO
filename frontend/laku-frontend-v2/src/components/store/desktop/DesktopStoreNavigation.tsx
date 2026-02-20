import { Store, StoreTab } from '@/types/store';
import { cn } from '@/lib/utils';

interface DesktopStoreNavigationProps {
  activeTab: StoreTab;
  onTabChange: (tab: StoreTab) => void;
  store: Store;
}

const tabs: { id: StoreTab; label: string; getCount?: (store: Store) => number | undefined }[] = [
  { id: 'products', label: 'All Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'tags', label: 'Tags', getCount: (store) => store.reviews.length },
  { id: 'about', label: 'About' },
  { id: 'recommend', label: 'Recommended' },
];

export function DesktopStoreNavigation({ activeTab, onTabChange, store }: DesktopStoreNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-8">
        <nav className="flex">
          {tabs.map((tab) => {
            const count = tab.getCount?.(store);
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "px-6 py-4 text-sm font-medium transition-colors relative",
                  isActive
                    ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <span>{tab.label}</span>
                {count !== undefined && (
                  <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}