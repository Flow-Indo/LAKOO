'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useMotionValue } from 'framer-motion';

interface Page {
  id: string;
  name: string;
  tabs?: string[];
  content: React.ReactNode;
}

interface SimpleSwipeContainerProps {
  pages: Page[];
  currentIndex?: number;
  onPageChange?: (pageId: string, index: number) => void;
}

export function SimpleSwipeContainer({ 
  pages, 
  currentIndex: externalIndex,
  onPageChange 
}: SimpleSwipeContainerProps) {
  const [internalIndex, setInternalIndex] = useState(externalIndex || 0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSecondNavVisible, setIsSecondNavVisible] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  // Sync with external index
  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;

  // Monitor scroll position to hide/show second nav
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop < 50) {
        setIsSecondNavVisible(true);
      } else {
        setIsSecondNavVisible(false);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    setDragOffset(info.offset.x);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    setDragOffset(0);
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Swipe threshold
    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= 100) {
      if (offset > 0 && currentIndex > 0) {
        const newIndex = currentIndex - 1;
        setInternalIndex(newIndex);
        onPageChange?.(pages[newIndex].id, newIndex);
      } else if (offset < 0 && currentIndex < pages.length - 1) {
        const newIndex = currentIndex + 1;
        setInternalIndex(newIndex);
        onPageChange?.(pages[newIndex].id, newIndex);
      }
    }
  };

  const currentPage = pages[currentIndex];
  const isMarketPage = currentPage.id === 'market';

  // Calculate peek opacity based on drag
  const getPeekOpacity = (index: number) => {
    if (!isDragging) return 0;
    const distance = index - currentIndex;
    
    if (distance === 1 && dragOffset < 0) {
      // Peeking next page (swipe left)
      const progress = Math.min(Math.abs(dragOffset) / 100, 1);
      return progress * 0.5;
    } else if (distance === -1 && dragOffset > 0) {
      // Peeking prev page (swipe right)
      const progress = Math.min(dragOffset / 100, 1);
      return progress * 0.5;
    }
    return 0;
  };

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Second Nav Bar - Only for Explore modes, hide on scroll */}
      {!isMarketPage && currentPage.tabs && (
        <motion.div
          className="sticky z-40 bg-white border-b border-gray-100"
          style={{ top: '56px' }}
          animate={{
            opacity: isSecondNavVisible ? 1 : 0,
            y: isSecondNavVisible ? 0 : -56,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-6 px-4 overflow-x-auto no-scrollbar">
            {currentPage.tabs.map((tab, idx) => (
              <button
                key={tab}
                className="relative py-3 whitespace-nowrap flex-shrink-0"
              >
                <span className={`text-sm font-medium ${idx === 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                  {tab}
                </span>
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main swipe container */}
      <div 
        className="w-full overflow-hidden"
        style={{ 
          height: isSecondNavVisible ? 'calc(100vh - 7rem)' : 'calc(100vh - 3.5rem)',
        }}
      >
        <motion.div
          ref={scrollRef}
          className="flex h-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={{
            x: -currentIndex * 100 + '%',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          style={{
            width: `${pages.length * 100}%`,
            touchAction: 'pan-y',
          }}
        >
          {pages.map((page, index) => {
            const isActive = index === currentIndex;
            const peekOpacity = getPeekOpacity(index);
            const isVisible = isActive || peekOpacity > 0;

            return (
              <div
                key={page.id}
                className="h-full overflow-y-auto overflow-x-hidden"
                style={{
                  width: `${100 / pages.length}%`,
                  opacity: isActive ? 1 : peekOpacity,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                {page.content}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Page Indicators */}
      <motion.div 
        className="fixed bottom-20 left-0 right-0 flex justify-center gap-1.5 z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {pages.map((page, index) => (
          <motion.div
            key={page.id}
            className="h-1 rounded-full"
            animate={{
              width: index === currentIndex ? 24 : 4,
              backgroundColor: index === currentIndex ? '#111827' : '#D1D5DB',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default SimpleSwipeContainer;
