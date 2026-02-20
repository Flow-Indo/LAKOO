'use client';

import { Search } from 'lucide-react';

interface MarketSubNavProps {
  onSearch?: (query: string) => void;
}

export function MarketSubNav({ onSearch }: MarketSubNavProps) {
  return (
    <div className="bg-white">
      <div className="px-3 py-1">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-xs placeholder-gray-500 focus:outline-none focus:border-gray-300 focus:bg-white transition-all"
            />
        </div>
      </div>
    </div>
  );
}

export default MarketSubNav;
