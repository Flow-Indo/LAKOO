'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import ProductName from './ProductName';
import { useState, useRef, useCallback } from 'react';

// Format price: Rp with comma for millions, 'k' for thousands
function formatPriceIDR(price: number, showRp: boolean = true): string {
  let formatted: string;
  if (price >= 1000000) {
    // Convert to k format with decimal: 1,250,000 -> 1.250k
    const thousands = price / 1000;
    formatted = `${thousands.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 3 })}k`;
  } else if (price >= 1000) {
    // Thousands - show with space and k: 850 k
    const thousands = Math.round(price / 1000);
    formatted = `${thousands}k`;
  } else {
    // Below thousands
    formatted = price.toLocaleString('id-ID');
  }
  return showRp ? `Rp ${formatted}` : formatted;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const rawImages = Array.isArray(product.images) ? product.images : [];
  // Extract image URLs from the images array (support both string and object formats)
  const imageUrls = rawImages.map((img) =>
    typeof img === 'string' ? img : (img as any)?.url
  ).filter(Boolean);
  
  // Fallback to product.image if no images array
  const allImages = imageUrls.length > 0 ? imageUrls : [product.image];
  
  // Start at index 0 (first actual image)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(-(allImages.length - 1) * 100);
  const [isResetting, setIsResetting] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Navigate to next image - slides left to show first from right
  const goToNext = useCallback(() => {
    if (isResetting) return;
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
    setTranslateX((prev) => prev - 100);
  }, [isResetting, allImages.length]);

  // Navigate to previous image - slides right to show last from left
  const goToPrev = useCallback(() => {
    if (isResetting) return;
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setTranslateX((prev) => prev + 100);
  }, [isResetting, allImages.length]);

  // Handle transition end - reset position silently for continuous loop
  const handleTransitionEnd = useCallback(() => {
    // If we went past the first image duplicate at the end (position N + duplicates at start)
    // translateX would be at -(allImages.length + (allImages.length - 1)) * 100 = -(2N-1)*100
    if (translateX <= -(2 * allImages.length - 1) * 100) {
      setIsResetting(true);
      setTranslateX(-(allImages.length - 1) * 100); // Reset to position (N-1), first actual image
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
    // If we went past position 0 (last image) when swiping right from first
    // translateX would be at 100 (blank, no image there)
    else if (translateX >= 100) {
      setIsResetting(true);
      setTranslateX(-(allImages.length - 1) * 100); // Reset to position (N-1), first actual image
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  }, [translateX, allImages.length]);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      touchStartX.current = null;
    }
  }, [goToNext, goToPrev]);

  const hasMultipleImages = allImages.length > 1;
  const rawImage = rawImages.length > 0 ? rawImages[0] : undefined;
  const imageSrc =
    typeof rawImage === 'string' ? rawImage : (rawImage as any)?.url || product.image || '/placeholder.jpg';
  const imageWidth = (rawImage as any)?.width;
  const imageHeight = (rawImage as any)?.height;

  // Use product.slug for dynamic href, fallback to id
  const productHref = product.slug ? `/product/${product.slug}` : `/product/prod-001`;

  return (
    <Link href={productHref} className="block w-full">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow w-full">
        {/* Image Container - Carousel with swipe support */}
        {(() => {
          // Prefer explicit product.imageTall when provided (deterministic from mock-data).
          const isTall = (product as any).imageTall === true;
          const paddingBottom = isTall ? `${1.5 * 100}%` : '100%';

          // If multiple images, use carousel
          if (hasMultipleImages) {
            return (
              <div
                className="w-full bg-gray-100 overflow-hidden rounded-t-lg relative"
                style={{ position: 'relative', width: '100%', paddingBottom }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {/* Continuous strip of images - with duplicates at ends for seamless looping */}
                <div
                  ref={containerRef}
                  className="absolute inset-0 flex h-full w-full"
                  style={{
                    transform: `translateX(${translateX}%)`,
                    transition: isResetting ? 'none' : 'transform 300ms ease-in-out',
                  }}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {/* Duplicates at beginning excluding first image (for swiping right from first) */}
                  {allImages.slice(1).map((img, index) => (
                    <div key={`dup-start-${index}`} className="relative flex-shrink-0 w-full h-full">
                      <Image
                        src={img}
                        alt={`${product.name} - Duplicate ${index}`}
                        fill
                        className="object-cover"
                        sizes="50vw"
                      />
                    </div>
                  ))}
                  {/* All images */}
                  {allImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-full h-full"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="50vw"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                  {/* First image at the end (for swiping left from last) */}
                  <div className="relative flex-shrink-0 w-full h-full">
                    <Image
                      src={allImages[0]}
                      alt={`${product.name} - First Image`}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                </div>
              </div>
            );
          }

          // Single image - no carousel needed
          return (
            <div
              className="w-full bg-gray-100 overflow-hidden rounded-t-lg"
              style={{ position: 'relative', width: '100%', paddingBottom }}
            >
              <Image
                src={allImages[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          );
        })()}

        {/* Product Info - consistent spacing for all lines */}
        <div className="p-2" style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {/* Product Name - ALWAYS SAME CONTAINER */}
          <div style={{ margin: 0, padding: 0 }}>
            <ProductName name={product.name} badge={product.isOfficial ? 'LAKU' : undefined} />
          </div>

          {/* Rating and Sales */}
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center gap-1 text-yellow-400">
              <span className="text-xs">★</span>
              <span className="font-medium text-gray-700">{(product.rating ?? 0).toFixed(1)}</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">{product.sold ?? 0} terjual</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-red-600 font-bold">
              <span className="text-xs">Rp</span>
              <span className="text-lg">{formatPriceIDR(product.price ?? 0, false)}</span>
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-xs line-through">
                {formatPriceIDR(product.originalPrice, false)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

