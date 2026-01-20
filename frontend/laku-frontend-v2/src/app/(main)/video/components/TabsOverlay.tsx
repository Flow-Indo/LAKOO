'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function TabsOverlay() {
  const { t } = useLanguage();

  const tabs = [
    { id: 'live', label: t('nav.live') },
    { id: 'shorts', label: t('nav.discovery') },
    { id: 'following', label: t('nav.profile') },
    { id: 'recommended', label: t('nav.discovery') },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pt-safe px-4">
      <div className="flex items-center justify-center">
        <div className="flex gap-3 backdrop-blur-md bg-black/40 rounded-full px-3 py-2">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              className={`text-xs font-medium px-3 py-1 rounded-sm transition-colors ${
                idx === 0 ? 'text-white border-b-2 border-white' : 'text-white/70 hover:text-white'
              }`}
              aria-label={tab.label}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

