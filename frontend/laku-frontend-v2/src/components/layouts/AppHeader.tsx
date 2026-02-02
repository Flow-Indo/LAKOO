'use client';

import { MessageCircle, Search } from 'lucide-react';
import Link from 'next/link';

interface AppHeaderProps {
  currentView?: 'explore' | 'market';
  onViewChange?: (view: 'explore' | 'market') => void;
}

export function AppHeader({ currentView = 'explore', onViewChange }: AppHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Messages Icon */}
        <Link href="/messages" className="p-2">
          <MessageCircle className="w-6 h-6 text-gray-700" />
        </Link>

        {/* Center: Explore | Market Tabs */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onViewChange?.('explore')}
            className="relative py-2"
          >
            <span
              className={`text-base font-medium ${
                currentView === 'explore' ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Explore
            </span>
            {currentView === 'explore' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>

          <button
            onClick={() => onViewChange?.('market')}
            className="relative py-2"
          >
            <span
              className={`text-base font-bold ${
                currentView === 'market' ? 'text-gray-900' : 'text-gray-500'
              }`}
              style={{
                fontFamily: 'cursive',
                fontSize: '18px',
              }}
            >
              Market
            </span>
            {currentView === 'market' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        </div>

        {/* Right: Search Icon */}
        <Link href="/search" className="p-2">
          <Search className="w-6 h-6 text-gray-700" />
        </Link>
      </div>
    </header>
  );
}

export default AppHeader;
