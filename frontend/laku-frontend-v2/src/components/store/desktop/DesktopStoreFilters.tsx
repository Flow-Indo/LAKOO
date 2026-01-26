'use client';

import { useState } from 'react';
import { Store, StoreFilter } from '@/types/store';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesktopStoreFiltersProps {
  store: Store;
  filters: StoreFilter;
  onFiltersChange: (filters: StoreFilter) => void;
}

export function DesktopStoreFilters({ store, filters, onFiltersChange }: DesktopStoreFiltersProps) {
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
    <div className="w-80 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
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

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-medium">Price Range</span>
          {expandedSections.price ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {expandedSections.price && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                className="px-3 py-2 border border-gray-300 rounded text-sm"
                value={filters.priceRange?.min || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  updateFilters({
                    priceRange: {
                      ...filters.priceRange,
                      min: isNaN(value) ? undefined : value
                    }
                  });
                }}
              />
              <input
                type="number"
                placeholder="Max"
                className="px-3 py-2 border border-gray-300 rounded text-sm"
                value={filters.priceRange?.max || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  updateFilters({
                    priceRange: {
                      ...filters.priceRange,
                      max: isNaN(value) ? undefined : value
                    }
                  });
                }}
              />
            </div>

            {/* Quick price options */}
            <div className="space-y-2">
              {[
                { label: 'Under Rp 50,000', min: 0, max: 50000 },
                { label: 'Rp 50k - 100k', min: 50000, max: 100000 },
                { label: 'Rp 100k - 200k', min: 100000, max: 200000 },
                { label: 'Over Rp 200,000', min: 200000, max: undefined },
              ].map((option) => (
                <label key={option.label} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    className="w-4 h-4 text-red-600"
                    checked={filters.priceRange?.min === option.min && filters.priceRange?.max === option.max}
                    onChange={() => updateFilters({
                      priceRange: { min: option.min, max: option.max }
                    })}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-medium">Rating</span>
          {expandedSections.rating ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {expandedSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  className="w-4 h-4 text-red-600"
                  checked={filters.rating === rating}
                  onChange={() => updateFilters({ rating })}
                />
                <span className="text-sm">{rating}★ & up</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Shipping */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('shipping')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-medium">Shipping</span>
          {expandedSections.shipping ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {expandedSections.shipping && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-red-600"
                checked={filters.shipping?.free || false}
                onChange={(e) => updateFilters({
                  shipping: { ...filters.shipping, free: e.target.checked }
                })}
              />
              <span className="text-sm">Free Shipping</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-red-600"
                checked={filters.shipping?.express || false}
                onChange={(e) => updateFilters({
                  shipping: { ...filters.shipping, express: e.target.checked }
                })}
              />
              <span className="text-sm">Express Delivery</span>
            </label>
          </div>
        )}
      </div>

      {/* Discount */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-red-600"
            checked={filters.discount || false}
            onChange={(e) => updateFilters({ discount: e.target.checked })}
          />
          <span className="text-sm font-medium">On Sale Only</span>
        </label>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.priceRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                Rp {filters.priceRange.min || 0} - {filters.priceRange.max || '∞'}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => updateFilters({ priceRange: undefined })}
                />
              </span>
            )}
            {filters.rating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                {filters.rating}★+
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => updateFilters({ rating: undefined })}
                />
              </span>
            )}
            {filters.discount && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                On Sale
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => updateFilters({ discount: undefined })}
                />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}