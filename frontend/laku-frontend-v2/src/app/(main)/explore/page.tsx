'use client';

import { useState, useRef, useCallback } from 'react';
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
import type { Product } from '@/types';

// Transform productsData to Product type for market feed
const getMarketProducts = (): Product[] => {
  return Object.values(productsData).map((product) => ({
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
    imageTall: true,
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

// Market products with our real product data
const MARKET_PRODUCTS = getMarketProducts();

export default function ExplorePage() {
  const [currentView, setCurrentView] = useState<'explore' | 'market'>('explore');
  const [currentTab, setCurrentTab] = useState('foryou');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleViewChange = useCallback((view: 'explore' | 'market') => {
    setCurrentView(view);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    const normalizedTab = tab.toLowerCase().replace(' ', '');
    setCurrentTab(normalizedTab);
  }, []);

  const handleLastTabReached = useCallback(() => {
    setCurrentView('market');
  }, []);

  const renderModeContent = () => {
    switch (currentTab) {
      case 'foryou':
        return <ForYouMode />;
      case 'video':
        return <VideoMode />;
      case 'live':
        return <LiveMode />;
      case 'nearby':
        return <NearbyMode />;
      case 'series':
        return <SeriesMode />;
      case 'travel':
        return <TravelMode />;
      default:
        return <ForYouMode />;
    }
  };

  return (
    <div className="bg-gray-50" style={{ height: '100vh', overflow: 'hidden' }}>
      <AppHeader
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <div 
        ref={containerRef}
        className="overflow-auto"
        style={{ 
          height: 'calc(100vh - 56px)',
          paddingTop: '56px',
          boxSizing: 'border-box'
        }}
      >
        {currentView === 'explore' ? (
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
            <MarketSubNav />
            <CategoryGrid />
            <InfiniteProductFeed initialProducts={MARKET_PRODUCTS} hasMore={true} />
          </>
        )}

        {/* Page Indicators */}
        <motion.div 
          className="fixed bottom-20 left-0 right-0 flex justify-center gap-1.5 z-30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`h-1 rounded-full ${currentView === 'explore' ? 'w-6 bg-gray-900' : 'w-1 bg-gray-300'}`} />
          <div className={`h-1 rounded-full ${currentView === 'market' ? 'w-6 bg-gray-900' : 'w-1 bg-gray-300'}`} />
        </motion.div>
      </div>
    </div>
  );
}
