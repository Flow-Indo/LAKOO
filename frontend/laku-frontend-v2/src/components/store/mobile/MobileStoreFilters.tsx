 'use client';

import { useState } from 'react';
import { Store, StoreFilter } from '@/types/store';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileStoreFiltersProps {
  store: Store;
  filters: StoreFilter;
  onFiltersChange: (filters: StoreFilter) => void;
}

export function MobileStoreFilters({ store, filters, onFiltersChange }: MobileStoreFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    rating: false,
    shipping: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilters = (newFilters: Partial<StoreFilter>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="w-full bg-white p-4 border-b border-gray-200">


      {/* Categories */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-medium">Categories</span>
          {expandedSections.categories ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="space-y-2">
            {store.categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">{category.name}</span>
                  <span className="text-xs text-gray-500">({category.productCount})</span>
                </div>
                {category.subcategories && (
                  <div className="ml-4 space-y-1">
                    {category.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between py-1">
                        <span className="text-xs text-gray-600">{sub.name}</span>
                        <span className="text-xs text-gray-400">({sub.productCount})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


      
    </div>
  );
}

