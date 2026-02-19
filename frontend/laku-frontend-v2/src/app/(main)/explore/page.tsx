'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ForYouMode } from '@/components/explore/modes/ForYouMode';
import { VideoMode } from '@/components/explore/modes/VideoMode';
import { LiveMode } from '@/components/explore/modes/LiveMode';
import { NearbyMode } from '@/components/explore/modes/NearbyMode';
import { SeriesMode } from '@/components/explore/modes/SeriesMode';
import { TravelMode } from '@/components/explore/modes/TravelMode';
import { ExploreSubNav } from '@/components/explore/ExploreSubNav';
import { CategoryGrid } from '@/components/market/CategoryGrid';
import { MarketSubNav } from '@/components/market/MarketSubNav';
import { InfiniteProductFeed } from '@/components/shared/InfiniteProductFeed';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { AppHeader } from '@/components/layouts/AppHeader';
import { productsData } from '@/lib/products-data';
import { ScrollVideoFeed } from '@/components/scroll/ScrollVideoFeed';
import { mockLiveShoppingVideos } from '@/lib/mock-live-shopping-data';
import { useBottomNav } from '@/components/layouts/BottomNavContext';
import type { Product } from '@/types';
import { OutfitOfTheDay } from '@/components/explore/OutfitOfTheDay';

// Products to EXCLUDE from market (these are posts only)
const POST_ONLY_SLUGS = [
  'lulu-combo',             // Lululemon combo - in explore feed as post
  'prada-mm-stanley-combo', // Luxury combo - in explore feed as post
];

// Products that should NOT have tall images (use normal aspect ratio)
const NORMAL_IMAGE_PRODUCTS = ['mm-tabi-flats'];

// Transform productsData to Product type for market feed
// Shows all original market products + new standalone products
// Returns in original order for SSR (no hydration mismatch)
const getMarketProductsOriginalOrder = (): Product[] => {
  return Object.values(productsData)
    .filter((product) => !POST_ONLY_SLUGS.includes(product.slug))
    .map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0,
      image: product.productImages[0],
      images: product.productImages.map((url) => ({ url })),
      imageTall: !NORMAL_IMAGE_PRODUCTS.includes(product.slug),
      isOfficial: true,
      category: product.productData.category,
      description: product.description,
      stock: product.productData.stock,
      rating: product.productData.rating,
      reviewCount: product.productData.reviewCount,
      sold: parseInt(product.productData.sold.replace(/[^0-9]/g, '')) * (product.productData.sold.includes('K') ? 1000 : 1),
      store: {
        id: `store-${product.brand.toLowerCase().replace(/\s+/g, '-')}`,
        name: product.brand,
        location: 'Jakarta',
      },
    }));
};

// Get original order products for SSR
const MARKET_PRODUCTS_ORIGINAL = getMarketProductsOriginalOrder();

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ExplorePage() {
  const { setHideBottomNav } = useBottomNav();
  const [currentView, setCurrentView] = useState<'scroll' | 'explore' | 'market'>('scroll');
  const [currentTab, setCurrentTab] = useState('For You');
  const [marketProducts, setMarketProducts] = useState<Product[]>(MARKET_PRODUCTS_ORIGINAL);
  const [isClient, setIsClient] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 = at top, 1 = fully scrolled
  const [currentBanner, setCurrentBanner] = useState(0);
  const [prevBanner, setPrevBanner] = useState(0);
  const [hideHeader, setHideHeader] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);
  const autoSwipeRef = useRef<NodeJS.Timeout | null>(null);
  
  const bannerImages = ['/bannermarket1.jpg', '/bannermarket2.webp', '/bannermarket3.jpg'];
  
  // Calculate transform position with circular wrapping logic
  const getTransformPosition = (index: number) => {
    const total = bannerImages.length;
    const diff = index - currentBanner;
    
    // Handle wrapping: if diff is more than half the array, wrap around
    if (diff > total / 2) {
      return (diff - total) * 100;
    } else if (diff < -total / 2) {
      return (diff + total) * 100;
    }
    return diff * 100;
  };
  
  // Reset auto-swipe timer (call on manual swipe)
  const resetAutoSwipe = useCallback(() => {
    if (autoSwipeRef.current) {
      clearInterval(autoSwipeRef.current);
    }
    autoSwipeRef.current = setInterval(() => {
      setPrevBanner(currentBanner);
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 6000);
  }, [currentBanner, bannerImages.length]);
  
  // Start auto-swipe on mount (only in market view)
  useEffect(() => {
    if (currentView === 'market') {
      resetAutoSwipe();
    }
    return () => {
      if (autoSwipeRef.current) {
        clearInterval(autoSwipeRef.current);
      }
    };
  }, [currentView, resetAutoSwipe]);
  
  // Handle touch swipe for banner carousel - swipe left = next, swipe right = prev
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    isDragging.current = true;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEndHandler = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > swipeThreshold) {
      setPrevBanner(currentBanner);
      resetAutoSwipe(); // Reset the auto-swipe timer on manual swipe
      if (diff > 0) {
        // Swipe left - next banner
        setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
      } else {
        // Swipe right - previous banner
        setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
      }
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  
  // Handle mouse drag for banner carousel
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    touchEndX.current = e.clientX;
    isDragging.current = true;
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const swipeThreshold = 50;
    const diff = touchStartX.current - e.clientX;
    
    if (Math.abs(diff) > swipeThreshold) {
      setPrevBanner(currentBanner);
      resetAutoSwipe(); // Reset the auto-swipe timer on manual swipe
      if (diff > 0) {
        // Swipe left - next banner
        setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
      } else {
        // Swipe right - previous banner
        setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
      }
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  
  // Shuffle market products on client after mount
  useEffect(() => {
    setIsClient(true);
    setMarketProducts(shuffleArray(MARKET_PRODUCTS_ORIGINAL));
  }, []);

  // Hide bottom nav when in scroll view (has its own bottom bar)
  useEffect(() => {
    setHideBottomNav(currentView === 'scroll');
  }, [currentView, setHideBottomNav]);

  // Track scroll for header background transition in Market view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const maxScroll = 80; // Faster transition to full white
      // Calculate progress from 0 to 1 based on scroll position
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewChange = useCallback((view: 'scroll' | 'explore' | 'market') => {
    setCurrentView(view);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setCurrentTab(tab);
  }, []);

  const handleLastTabReached = useCallback(() => {
    setCurrentView('market');
  }, []);

  const renderModeContent = () => {
    switch (currentTab) {
      case 'For You':
      case 'Following':
      case 'Korea':
      case 'Workwear':
      case 'Sportswear':
      case 'Performative':
      case 'Muslimwear':
        return <ForYouMode />;
      default:
        return <ForYouMode />;
    }
  };

  return (
    <div className="bg-gray-50 relative" style={{ height: '100dvh', overflow: 'hidden' }}>
      <AppHeader
        currentView={currentView}
        onViewChange={handleViewChange}
        transparent={currentView === 'market'}
        scrollProgress={scrollProgress}
        bannerImage={currentView === 'market' ? bannerImages[currentBanner] : undefined}
      />

      <div 
        ref={containerRef}
        className={`overflow-auto ${currentView === 'scroll' ? 'fixed inset-0' : ''} ${currentView === 'market' ? 'bg-white overflow-x-hidden' : ''}`}
        style={{ 
          height: currentView === 'scroll' ? '100dvh' : 'calc(100dvh - 56px)',
          paddingTop: currentView === 'scroll' ? '0' : '56px',
          paddingBottom: currentView === 'scroll' ? '0' : '0',
          boxSizing: 'border-box',
          zIndex: currentView === 'scroll' ? 60 : undefined
        }}
      >
        {currentView === 'scroll' ? (
          <div className="h-full relative">
            <ScrollVideoFeed 
              videos={mockLiveShoppingVideos} 
              onSwipeBack={() => setCurrentView('explore')}
              onCommentOpen={() => setHideHeader(true)}
              onCommentClose={() => setHideHeader(false)}
            />
          </div>
        ) : currentView === 'explore' ? (
          <>
            <div className="sticky top-0 z-40 bg-white">
              <ExploreSubNav
                onTabChange={handleTabChange}
                onLastTabReached={handleLastTabReached}
              />
            </div>
            {renderModeContent()}
          </>
        ) : (
          <>
            {currentView === 'market' && (
              <div className="relative w-full overflow-hidden" style={{ height: '250px' }}>
                {/* Banner images with seamless circular wrapping */}
                {bannerImages.map((image, index) => (
                  <div
                    key={index}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEndHandler}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="absolute inset-0 bg-cover bg-center w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300 ease-in-out"
                    style={{
                      backgroundImage: `url('${image}')`,
                      transform: `translateX(${getTransformPosition(index)}%)`,
                      zIndex: index === currentBanner ? 1 : 0
                    }}
                  />
                ))}
                <div 
                  className="flex justify-center items-center gap-1.5 px-3 py-2 absolute bottom-0 left-0 right-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
                    zIndex: 2
                  }}
                >
                  {bannerImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`rounded-full transition-all duration-300 ${
                        currentBanner === index 
                          ? 'w-5 h-1.5' 
                          : 'w-2 h-2 hover:bg-white/80'
                      }`}
                      style={{
                        backgroundColor: currentBanner === index ? '#ff2742' : 'rgba(255, 255, 255, 0.6)',
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
            <OutfitOfTheDay />
            <CategoryGrid />
            <InfiniteProductFeed initialProducts={marketProducts} hasMore={true} />
          </>
        )}
      </div>
    </div>
  );
}
