'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface ExploreSubNavProps {
  onLastTabReached?: () => void;
  onTabChange?: (tab: string) => void;
  onSwipeToMarket?: () => void;
  externalActiveTab?: string;
  onNavigateTab?: (direction: 'left' | 'right') => void;
}

export function ExploreSubNav({
  onLastTabReached,
  onTabChange,
  onSwipeToMarket,
  externalActiveTab,
  onNavigateTab,
}: ExploreSubNavProps) {
  const [activeTab, setActiveTab] = useState('For You');
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = [
    'For You',
    'Following',
    'Korea',
    'Workwear',
    'Sportswear',
    'Performative',
    'Muslimwear',
  ];

  // Scroll to tab on external active tab change
  useEffect(() => {
    if (externalActiveTab && tabs.includes(externalActiveTab)) {
      setActiveTab(externalActiveTab);
      scrollToTab(externalActiveTab);
    }
  }, [externalActiveTab]);

  const scrollToTab = (tab: string) => {
    const element = scrollRef.current?.querySelector(`button[data-tab="${tab}"]`);
    element?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    scrollToTab(tab);
    onTabChange?.(tab);

    if (tabs.indexOf(tab) === tabs.length - 1) {
      onLastTabReached?.();
    }
  };

  return (
    <div
      ref={scrollRef}
      className="bg-white border-b border-gray-100"
    >
      <div
        className="flex items-center gap-6 px-4 overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            data-tab={tab}
            onClick={() => handleTabClick(tab)}
            className="relative py-3 whitespace-nowrap flex-shrink-0"
          >
            <span
              className={`text-sm font-medium ${
                activeTab === tab ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {tab}
            </span>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        ))}

        <div className="flex items-center gap-1 px-2 text-xs text-gray-400 whitespace-nowrap">
          <span>Market</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

export default ExploreSubNav;
