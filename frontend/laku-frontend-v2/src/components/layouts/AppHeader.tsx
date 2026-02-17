'use client';

import { MessageCircle, Search } from 'lucide-react';
import Link from 'next/link';

interface AppHeaderProps {
  currentView?: 'scroll' | 'explore' | 'market';
  onViewChange?: (view: 'scroll' | 'explore' | 'market') => void;
  transparent?: boolean;
}

export function AppHeader({ currentView = 'scroll', onViewChange, transparent = false }: AppHeaderProps) {
  const isTransparent = transparent || currentView === 'scroll';
  
  return (
    <header className={`fixed top-0 left-0 right-0 ${isTransparent ? 'z-[70]' : 'z-50'} ${isTransparent ? 'bg-transparent' : 'bg-white border-b border-gray-200'}`}>
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Messages Icon */}
        <Link href="/messages" className="p-2">
          <MessageCircle className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-gray-700'}`} />
        </Link>

        {/* Center: Scroll | Explore | Market Tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onViewChange?.('scroll')}
            className="relative py-2"
          >
            <span
              className={`text-base font-medium ${
                currentView === 'scroll' 
                  ? (isTransparent ? 'text-white' : 'text-gray-900') 
                  : (isTransparent ? 'text-white/70' : 'text-gray-500')
              }`}
            >
              Scroll
            </span>
            {currentView === 'scroll' && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isTransparent ? 'bg-white' : 'bg-gray-900'}`} />
            )}
          </button>

          <button
            onClick={() => onViewChange?.('explore')}
            className="relative py-2"
          >
            <span
              className={`text-base font-medium ${
                currentView === 'explore' 
                  ? (isTransparent ? 'text-white' : 'text-gray-900') 
                  : (isTransparent ? 'text-white/70' : 'text-gray-500')
              }`}
            >
              Explore
            </span>
            {currentView === 'explore' && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isTransparent ? 'bg-white' : 'bg-gray-900'}`} />
            )}
          </button>

          <button
            onClick={() => onViewChange?.('market')}
            className="relative py-2"
          >
            <span
              className={`text-base font-bold ${
                currentView === 'market' 
                  ? (isTransparent ? 'text-white' : 'text-gray-900') 
                  : (isTransparent ? 'text-white/70' : 'text-gray-500')
              }`}
              style={{
                fontFamily: 'cursive',
                fontSize: '18px',
              }}
            >
              Market
            </span>
            {currentView === 'market' && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isTransparent ? 'bg-white' : 'bg-gray-900'}`} />
            )}
          </button>
        </div>

        {/* Right: Search Icon */}
        <Link href="/search" className="p-2">
          <Search className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-gray-700'}`} />
        </Link>
      </div>
    </header>
  );
}

export default AppHeader;
