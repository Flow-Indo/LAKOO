'use client';

import type { ProductTab } from '@/types/product';

interface Props {
  tabs: ProductTab[];
  activeTab: ProductTab['id'];
  onTabChange: (tabId: ProductTab['id']) => void;
}

export function ProductTabs({ tabs, activeTab, onTabChange }: Props) {
  return (
    <div className="sticky top-14 md:top-16 bg-white border-b border-gray-200 shadow-sm z-20 md:relative md:shadow-none md:top-auto">
      <div className="flex px-4 md:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-4 px-4 text-center border-b-2 font-medium transition-colors relative md:px-6 ${
              activeTab === tab.id
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.count && tab.count > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}