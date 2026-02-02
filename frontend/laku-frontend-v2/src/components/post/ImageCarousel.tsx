'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import ProductTag from './ProductTag';
import { ProductData, ProductTag as ProductTagType } from '@/lib/products-data';

interface ImageCarouselProps {
  images: string[];
  isLive?: boolean;
  aspectRatio?: '1/1' | '3/4' | '4/3' | '16/9';
  taggedProducts?: Array<ProductData & { tag: ProductTagType }>;
}

const aspectRatioClasses: Record<string, string> = {
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
};

export default function ImageCarousel({
  images,
  isLive = false,
  aspectRatio = '3/4',
  taggedProducts = []
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTags, setShowTags] = useState(true);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="relative w-full bg-gray-100 rounded-lg flex items-center justify-center aspect-[3/4]">
        <p className="text-gray-400">Tidak ada gambar tersedia</p>
      </div>
    );
  }

  const isSingleImage = images.length === 1;

  // Get tags for current slide
  const currentImageTags = taggedProducts.filter(
    item => item.tag.imageIndex === currentIndex
  );

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    // Reset showTags when entering/exiting fullscreen
    setShowTags(true);
  }, []);

  // Toggle tags visibility
  const toggleTags = useCallback((e: React.MouseEvent) => {
    // Don't toggle if clicking on a product tag
    if ((e.target as HTMLElement).closest('.product-tag')) return;
    setShowTags((prev) => !prev);
  }, []);

  // Touch handlers for swiping
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      touchStartX.current = null;
    }
  }, [goToNext, goToPrev]);

  // Keyboard navigation for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, goToNext, goToPrev]);

  // Single image rendering
  if (isSingleImage) {
    return (
      <div className={`relative w-full bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Black background for fullscreen */}
        {isFullscreen && (
          <div className="fixed inset-0 bg-black" />
        )}
        <div className={`relative w-full ${isFullscreen ? 'h-screen' : aspectRatioClasses[aspectRatio]} bg-gray-200 overflow-hidden`}>
          {/* Live Badge */}
          {isLive && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff2742] to-[#ff5c7c]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="text-white text-xs font-semibold uppercase">LIVE</span>
            </div>
          )}

          <Image
            src={images[0]}
            alt="Gambar 1"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />

          {/* Product Tags Overlay */}
          {currentImageTags.map((item, tagIndex) => (
            <div key={tagIndex} className={`product-tag ${showTags || isFullscreen ? '' : 'opacity-0'}`}>
              <ProductTag
                productName={`${item.brand} - ${item.name}`}
                productSlug={item.slug}
                position={item.tag.position}
                visible={showTags || isFullscreen}
                isHidden={!showTags}
              />
            </div>
          ))}

          {/* Fullscreen button */}
          {!isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-4 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center z-20 shadow-lg transition-all"
            >
              <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          )}

          {/* Exit fullscreen button */}
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center z-50 transition-all"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Black background for fullscreen */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black" />
      )}

      {/* Image Container with overflow hidden */}
      <div 
        className={`relative w-full ${isFullscreen ? 'h-screen' : aspectRatioClasses[aspectRatio]} overflow-hidden ${!isSingleImage ? 'cursor-pointer' : ''}`}
        onTouchStart={isFullscreen ? undefined : handleTouchStart}
        onTouchMove={isFullscreen ? undefined : handleTouchMove}
        onClick={isFullscreen ? undefined : toggleTags}
      >
        {/* Images with absolute positioning and transforms */}
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
          >
            {/* Live Badge - Only on first image */}
            {index === 0 && isLive && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff2742] to-[#ff5c7c]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span className="text-white text-xs font-semibold uppercase">LIVE</span>
              </div>
            )}

            <div className="relative w-full h-full bg-gray-200">
              <Image
                src={image}
                alt={`Gambar ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />

              {/* Product Tags Overlay */}
              {currentImageTags.map((item, tagIndex) => (
                <div key={tagIndex} className={`product-tag ${showTags || isFullscreen ? '' : 'opacity-0'}`}>
                  <ProductTag
                    productName={`${item.brand} - ${item.name}`}
                    productSlug={item.slug}
                    position={item.tag.position}
                    visible={index === currentIndex && (showTags || isFullscreen)}
                    isHidden={!showTags}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Image Counter */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm z-10">
          <span className="text-white text-xs font-medium">
            {currentIndex + 1}/{images.length}
          </span>
        </div>

        {/* Navigation arrows - only in fullscreen */}
        {isFullscreen && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center z-20 transition-all"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center z-20 transition-all"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Fullscreen button - only in normal mode */}
        {!isFullscreen && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="absolute bottom-4 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center z-20 shadow-lg transition-all"
          >
            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        )}
      </div>

      {/* Dot Indicators - Below carousel */}
      {!isFullscreen && (
        <div className="flex justify-center items-center gap-1.5 px-3 py-2 bg-white">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all ${
                index === currentIndex
                  ? 'w-5 h-1.5 bg-[#ff2742]'
                  : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Exit fullscreen button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center z-50 transition-all"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
