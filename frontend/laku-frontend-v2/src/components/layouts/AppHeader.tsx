'use client';

import { MessageCircle, Search } from 'lucide-react';
import Link from 'next/link';

interface AppHeaderProps {
  currentView?: 'scroll' | 'explore' | 'market';
  onViewChange?: (view: 'scroll' | 'explore' | 'market') => void;
  transparent?: boolean;
  extendedBottom?: boolean;
  scrollProgress?: number; // 0 = at top, 1 = fully scrolled
  bannerImage?: string; // Current banner image URL
}

export function AppHeader({ currentView = 'scroll', onViewChange, transparent = false, extendedBottom = false, scrollProgress = 0, bannerImage }: AppHeaderProps) {
  const isTransparent = transparent || currentView === 'scroll';
  const isMarketView = currentView === 'market';
  
  // Calculate background opacity based on scroll progress (0 to 1)
  const bgOpacity = isMarketView ? scrollProgress : 0;
  
  // Determine background style based on scroll
  const getBackgroundStyle = () => {
    if (!isMarketView) {
      return {
        backgroundColor: isTransparent ? 'transparent' : 'rgb(255, 255, 255)',
        backgroundImage: 'none',
      };
    }
    
      // At scrollProgress = 0, show banner image at top (blurred)
      if (scrollProgress === 0 && bannerImage) {
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        };
      }
    
    // As we scroll, transition to white
    return {
      backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
      backgroundImage: 'none',
    };
  };
  
  const bgStyle = getBackgroundStyle();
  
  // Color changes when scroll progress exceeds threshold
  const scrollThreshold = 0.1;
  
  // Text color transition: white at top, gray-900 when scrolled past threshold
  const textColor = isMarketView 
    ? `rgb(17 24 39 / ${0.5 + (scrollProgress * 0.5)})` // Mix between white (0.5) and gray-900
    : isTransparent ? 'white' : 'rgb(55 65 71)'; // gray-700
  const iconColor = isMarketView
    ? (scrollProgress > scrollThreshold ? 'rgb(17, 24, 39)' : 'white')
    : (isTransparent ? 'white' : 'rgb(17, 24, 39)');
  const underlineColor = isMarketView ? 'rgb(17 24 39)' : (isTransparent ? 'white' : 'rgb(17 24 39)');
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 backdrop-blur-xl ${isTransparent ? 'z-[70]' : 'z-50'}`}
      style={{
        ...bgStyle,
        transition: 'background-color 0.3s ease-out, background-image 0.3s ease-out'
      }}
    >
      {/* Blurred background layer - market view only */}
      {isMarketView && scrollProgress === 0 && bannerImage && (
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url('${bannerImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)', // Prevent blur edges from showing
          }}
        />
      )}
      <div className={`flex items-center justify-between px-4 h-14 ${extendedBottom ? 'pb-8' : ''}`}>
        {/* Left: Messages Icon */}
        <Link href="/messages" className="p-2 -mt-2">
          <MessageCircle className="w-6 h-6" style={{ color: iconColor }} />
        </Link>

        {/* Center: Scroll | Explore | Market Tabs */}
        <div className="flex items-center gap-6 -mt-2">
          <button
            onClick={() => onViewChange?.('scroll')}
            className="relative py-2"
          >
            <span
              className="text-base font-medium"
              style={{
                color: currentView === 'scroll' 
                  ? (isMarketView ? (scrollProgress > scrollThreshold ? 'rgb(17, 24, 39)' : 'white') : (isTransparent ? 'white' : 'rgb(17, 24, 39)'))
                  : (isMarketView ? (scrollProgress > scrollThreshold ? 'rgb(17, 24, 39)' : 'rgba(255, 255, 255, 0.7)') : (isTransparent ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107, 114, 128)'))
              }}
            >
              Scroll
            </span>
            {currentView === 'scroll' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: isMarketView && scrollProgress > scrollThreshold ? 'rgb(17, 24, 39)' : (isTransparent ? 'white' : 'rgb(17, 24, 39)') }} />
            )}
          </button>

          <button
            onClick={() => onViewChange?.('explore')}
            className="relative py-2"
          >
            <span
              className="text-base font-medium"
              style={{
                color: currentView === 'explore' 
                  ? (isMarketView ? (scrollProgress > scrollThreshold ? 'rgb(17, 24, 39)' : 'white') : (isTransparent ? 'white' : 'rgb(17, 24, 39)'))
                  : (isMarketView ? (scrollProgress > scrollThreshold ? 'rgb(17, 24, 39)' : 'rgba(255, 255, 255, 0.7)') : (isTransparent ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107, 114, 128)'))
              }}
            >
              Explore
            </span>
            {currentView === 'explore' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: isMarketView && scrollProgress > scrollThreshold ? 'rgb(17, 24, 39)' : (isTransparent ? 'white' : 'rgb(17, 24, 39)') }} />
            )}
          </button>

          <button
            onClick={() => onViewChange?.('market')}
            className="relative py-2"
          >
            <span
              className="text-base font-bold"
              style={{
                color: currentView === 'market' 
                  ? (isMarketView ? (scrollProgress > scrollThreshold ? 'rgb(17, 24, 39)' : 'white') : (isTransparent ? 'white' : 'rgb(17, 24, 39)'))
                  : (isMarketView ? (scrollProgress > scrollThreshold ? 'rgb(17, 24, 39)' : 'rgba(255, 255, 255, 0.7)') : (isTransparent ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107, 114, 128)')),
                fontFamily: 'cursive',
                fontSize: '18px',
              }}
            >
              Market
            </span>
            {currentView === 'market' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: isMarketView && scrollProgress > scrollThreshold ? 'rgb(17, 24, 39)' : (isTransparent ? 'white' : 'rgb(17, 24, 39)') }} />
            )}
          </button>
        </div>

        {/* Right: Search Icon */}
        <Link href="/search" className="p-2 -mt-2">
          <Search className="w-6 h-6" style={{ color: iconColor }} />
        </Link>
      </div>
    </header>
  );
}

export default AppHeader;
