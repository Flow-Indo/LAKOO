'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw } from 'lucide-react';

const categories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
  'Beauty',
  'Automotive',
  'Toys & Games'
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ProductFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000000]);
    setSelectedSizes([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm">Categories</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000000}
            min={0}
            step={50000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                selectedSizes.includes(size)
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedCategories.length > 0 || selectedSizes.length > 0) && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 text-sm mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full"
              >
                {category}
              </span>
            ))}
            {selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
              >
                Size {size}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}