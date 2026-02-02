'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface SearchLandingProps {
  onSearch: (query: string) => void;
}

export default function SearchLanding({ onSearch }: SearchLandingProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentSearches(parsed);
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    } else {
      // Initialize with default searches for demo
      const defaultSearches = [
        'Fashion wanita',
        'Makeup tutorial',
        'OOTD inspirasi',
        'Resep sehat',
        'Tips traveling'
      ];
      setRecentSearches(defaultSearches);
      localStorage.setItem('recentSearches', JSON.stringify(defaultSearches));
    }
    setIsLoaded(true);
  }, []);

  const handleSearchClick = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    onSearch(query);
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const discoverSuggestions = [
    ['Fashion wanita terbaru', 'Outfit OOTD inspirasi'],
    ['Makeup tutorial pemula', 'Resep masakan sehat'],
    ['Tips traveling hemat', 'Dekorasi kamar aesthetic']
  ];

  const trendingTopics = [
    { id: 1, title: 'Fashion Lebaran 2026', views: '9.3jt', badge: 'Hot' },
    { id: 2, title: 'Tutorial Makeup Natural', views: '8.2jt', badge: 'Hot' },
    { id: 3, title: 'OOTD Kuliah Aesthetic', views: '7.9jt', badge: 'Baru' },
    { id: 4, title: 'Resep Kue Kering', views: '6.5jt', badge: null },
    { id: 5, title: 'Tips Diet Sehat', views: '5.8jt', badge: null }
  ];

  return (
    <div className="px-4 py-4 bg-white min-h-screen">
        {/* Recent Searches - ALWAYS SHOW THIS SECTION */}
        {isLoaded && recentSearches.length > 0 && (
          <div className="mb-96" style={{ marginBottom: '20px' }}>
          <div className="flex items-center justify-between mb-3" style={{ marginBottom: '12px' }}>
            <h2 className="text-[15px] font-semibold text-gray-900">
              Pencarian Terbaru
            </h2>
            <button
              onClick={handleClearHistory}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
            </button>
          </div>

          {/* Recent Search Pills */}
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearchClick(search)}
                className="h-8 px-3.5 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-[14px] text-gray-700 transition-colors"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Jelajahi Section - MORE SPACING */}
      <div className="mt-32 mb-96" style={{ marginBottom: '30px' }}>
        <div className="flex items-center justify-between mb-3" style={{ marginBottom: '12px' }}>
          <h2 className="text-[15px] font-semibold text-gray-900">
            Jelajahi
          </h2>
          <button className="text-gray-400 hover:text-gray-600 px-1">
            <span className="text-base">···</span>
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {discoverSuggestions.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((suggestion, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => handleSearchClick(suggestion)}
                  className="h-10 px-3 bg-white hover:bg-gray-50 rounded-lg text-[14px] text-gray-700 transition-colors flex items-center justify-center text-center leading-tight"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                  {suggestion}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Trending Section - MORE SPACING */}
      <div className="mt-8" style={{ marginTop: '0px' }}>
        {/* Header with Fire Icon */}
        <div className="flex items-center gap-1.5 mb-4" style={{ marginBottom: '16px' }}>
          <svg className="w-5 h-5 text-[#FF2442]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 01-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6-1.12.4-2.24-.16-2.9-.82 1.19-.28 1.9-1.16 2.11-2.05.17-.8-.15-1.46-.28-2.23-.12-.74-.1-1.37.17-2.06.19.38.39.76.63 1.06.77 1 1.98 1.44 2.24 2.8.04.14.06.28.06.43.03.82-.33 1.72-.93 2.27z"/>
          </svg>
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            TRENDING LAKU
          </h2>
        </div>

        {/* Trending List */}
        <div className="space-y-0">
          {trendingTopics.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => handleSearchClick(topic.title)}
              className="w-full flex items-center gap-2.5 py-2.5 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
            >
              {/* Number with Color Gradient */}
              <span className={`text-[17px] font-bold w-5 ${
                index === 0 ? 'text-[#FF2442]' :
                index === 1 ? 'text-[#FF6B35]' :
                index === 2 ? 'text-[#FFA500]' :
                'text-gray-400'
              }`}>
                {index + 1}
              </span>

              {/* Topic Title */}
              <span className="flex-1 text-left text-[15px] text-gray-900 font-medium">
                {topic.title}
              </span>

              {/* Hot/New Badge */}
              {topic.badge && (
                <span className={`h-[18px] px-1.5 flex items-center justify-center rounded text-[11px] text-white font-medium ${
                  topic.badge === 'Hot' ? 'bg-[#FF2442]' : 'bg-[#FF6B35]'
                }`}>
                  {topic.badge}
                </span>
              )}

              {/* View Count */}
              <span className="text-[13px] text-gray-400 tabular-nums">
                {topic.views}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
