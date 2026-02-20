'use client';

import { useState, useEffect, useRef } from 'react';
import { RefreshCcw, ShoppingCart, Star } from 'lucide-react';
import { useBottomNav } from '@/components/layouts/BottomNavContext';
import Link from 'next/link';
import { productsData, ProductData } from '@/lib/products-data';

interface OutfitItem {
  image: string;
  caption: string;
  productSlugs: string[];
}

const allOutfits: OutfitItem[] = [
  { image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk2.webp', caption: '🌴 Jakarta Summer Vibes', productSlugs: ['karakiri', 'cult-suri', 'prada-tote-bag', 'lulu-softstreme-pant', 'wearthreek'] },
  { image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk3.webp', caption: '✨ Weekend Chill Mode', productSlugs: ['stanley-quencher', 'mm-tabi-flats', 'cult-suri', 'prada-tote-bag', 'lulu-softstreme-pant'] },
  { image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk.webp', caption: '💼 Office Glam', productSlugs: ['wearthreek', 'cult-suri', 'prada-tote-bag', 'mm-tabi-flats', 'karakiri'] },
  { image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk2.webp', caption: '🏖️ Beach Day Ready', productSlugs: ['cult-suri', 'karakiri', 'lulu-softstreme-pant', 'wearthreek', 'stanley-quencher'] },
  { image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor1.webp', caption: '🌙 Date Night ✨', productSlugs: ['cult-suri', 'mm-tabi-flats', 'prada-tote-bag', 'karakiri', 'wearthreek'] },
  { image: '/products/Lululemon - Softstreme Zip-Flared Pant/softstreme_produk.webp', caption: '🧘 Yoga Session', productSlugs: ['lulu-softstreme-pant', 'lulu-swiftly-ls', 'cult-suri', 'karakiri', 'stanley-quencher'] },
  { image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk.webp', caption: '👗 Casual Date', productSlugs: ['rue', 'karakiri', 'wearthreek', 'cult-suri', 'mm-tabi-flats'] },
  { image: '/products/Lululemon - Swiftly Tech Long Sleeve/swiftly_produk.webp', caption: '🏃‍♀️ Workout Ready', productSlugs: ['lulu-swiftly-ls', 'lulu-softstreme-pant', 'cult-suri', 'stanley-quencher', 'karakiri'] },
  { image: '/products/Prada - Black Medium Leather Tote Bag/prada_produk.webp', caption: '👜 Luxury Touch', productSlugs: ['prada-tote-bag', 'mm-tabi-flats', 'cult-suri', 'karakiri', 'wearthreek'] },
  { image: '/products/Maison Margiela - Tabi Ballerina Flats/mm_produk.webp', caption: '👠 Elegant Steps', productSlugs: ['mm-tabi-flats', 'prada-tote-bag', 'cult-suri', 'karakiri', 'lulu-softstreme-pant'] },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomOutfits(outfits: OutfitItem[], count: number): OutfitItem[] {
  const shuffled = shuffleArray(outfits);
  return shuffled.slice(0, count);
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function OutfitOfTheDay() {
  const [selectedOutfits, setSelectedOutfits] = useState<OutfitItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [key, setKey] = useState(0); // Used to force re-render for shuffle animation
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleRatio, setVisibleRatio] = useState(1);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem | null>(null);
  const [popupProducts, setPopupProducts] = useState<ProductData[]>([]);
  const [isClosing, setIsClosing] = useState(false); // For closing animation
  const [dragY, setDragY] = useState(0); // Track vertical drag position
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const { setHideBottomNav } = useBottomNav();

  // Lock body scroll when popup is open
  useEffect(() => {
    // Prevent scroll function
    const preventScroll = (e: TouchEvent) => {
      if (selectedOutfit) {
        e.preventDefault();
      }
    };

    if (selectedOutfit) {
      // Prevent body scroll - more aggressive mobile approach
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.touchAction = 'none';
      // Add passive: false to allow preventDefault
      document.addEventListener('touchmove', preventScroll, { passive: false });
      // Hide bottom nav
      setHideBottomNav(true);
    } else {
      // Restore body scroll
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.touchAction = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY.slice(1) || '0', 10));
      }
      // Show bottom nav
      setHideBottomNav(false);
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.touchAction = '';
      setHideBottomNav(false);
    };
  }, [selectedOutfit, setHideBottomNav]);

  // Handle swipe down to close
  const handleDragStart = (clientY: number) => {
    dragStartY.current = clientY;
    setIsDragging(true);
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging) return;
    const diff = clientY - dragStartY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Close if dragged down more than 100px
    if (dragY > 100) {
      setIsClosing(true);
      setTimeout(() => {
        setSelectedOutfit(null);
        setIsClosing(false);
        setDragY(0);
      }, 300);
    } else {
      setDragY(0);
    }
  };

  // Load products when outfit is selected
  useEffect(() => {
    if (selectedOutfit && selectedOutfit.productSlugs) {
      const products = selectedOutfit.productSlugs
        .map(slug => productsData[slug])
        .filter((p): p is ProductData => p !== undefined);
      setPopupProducts(products);
    } else {
      setPopupProducts([]);
    }
  }, [selectedOutfit]);

  // Initialize with 4 random outfits
  useEffect(() => {
    setSelectedOutfits(getRandomOutfits(allOutfits, 9));
  }, []);

  // Calculate initial visible ratio on mount
  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      setVisibleRatio(clientWidth / scrollWidth);
    }
  }, [selectedOutfits]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          return 24 * 60 * 60; // Reset to 24 hours
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle scroll to update active indicator
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const itemWidth = 110 + 16; // item width + gap
      
      // Calculate continuous scroll progress (0 to 100)
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
      
      // Calculate visible ratio (visible width / total content width)
      const visible = clientWidth / scrollWidth;
      setVisibleRatio(visible);
      
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(newIndex, selectedOutfits.length - 1));
    }
  };

  const handleRefresh = () => {
    // Shuffle all 4 positions with new random selection from 5 options
    const shuffled = getRandomOutfits(allOutfits, 9);
    setSelectedOutfits(shuffled);
    setKey(prev => prev + 1); // Force re-render
    setTimeLeft(24 * 60 * 60); // Reset timer to 24 hours
  };

  if (selectedOutfits.length === 0) return null;

  return (
    <div className="w-full py-4 bg-[#FFF0F3] relative" style={{ marginTop: '10px', marginBottom: '10px' }}>
      {/* Top gradient overlay */}
      <div 
        className="absolute top-0 left-0 right-0 h-8 pointer-events-none" 
        style={{ background: 'linear-gradient(to bottom, white, transparent)' }}
      />
      {/* Bottom gradient overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" 
        style={{ background: 'linear-gradient(to top, white, transparent)' }}
      />
      
      {/* Caption */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 mb-[10px] pb-[10px] pt-[5px]">Outfit Of The Day For You</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold text-gray-900">
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Refresh outfits"
          >
            <RefreshCcw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Horizontal scrollable container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-4 px-4 pb-2 pt-[10px] scrollbar-hide"
      >
        {selectedOutfits.map((outfit, index) => (
          <div 
            key={`${key}-${index}`} 
            className="flex flex-col items-start gap-2 flex-shrink-0 cursor-pointer"
            onClick={() => setSelectedOutfit(outfit)}
          >
            <div className="w-[110px] h-[150px] rounded-lg overflow-hidden">
              <img
                src={outfit.image}
                alt={outfit.caption}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[110px]">
              <span className="text-xs text-gray-700 font-medium block truncate">{outfit.caption}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Half Popup Modal */}
      {selectedOutfit && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => {
            setIsClosing(true);
            setTimeout(() => {
              setSelectedOutfit(null);
              setIsClosing(false);
              setDragY(0);
            }, 300);
          }}
          onTouchMove={(e) => {
            if (selectedOutfit) {
              e.preventDefault();
            }
          }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => {
              setIsClosing(true);
              setTimeout(() => {
                setSelectedOutfit(null);
                setIsClosing(false);
                setDragY(0);
              }, 300);
            }}
            onTouchMove={(e) => {
              if (selectedOutfit) {
                e.preventDefault();
              }
            }}
          />
          
          {/* Popup Content */}
          <div 
            className={`relative w-full max-w-md bg-white rounded-t-2xl max-h-[70vh] overflow-hidden ${isClosing ? 'animate-slideDown' : 'animate-slideUp'}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: `translateY(${dragY}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            }}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
            onTouchMove={(e) => {
              e.preventDefault();
              handleDragMove(e.touches[0].clientY);
            }}
            onTouchEnd={handleDragEnd}
            onMouseDown={(e) => handleDragStart(e.clientY)}
            onMouseMove={(e) => isDragging && handleDragMove(e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {/* Handle bar */}
            <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Shop the Look</h3>
            </div>
            
            {/* Outfit Preview */}
            <div className="px-4 py-3 bg-[#FFF0F3]">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={selectedOutfit.image}
                    alt={selectedOutfit.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedOutfit.caption}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{popupProducts.length} products available</p>
                </div>
              </div>
            </div>
            
            {/* Product Cards */}
            <div className="p-2 overflow-y-auto max-h-[calc(70vh-180px)]">
              <div className="space-y-3">
                {popupProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <Link 
                      href={`/product/${product.slug}`}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group w-full block"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={product.productImages[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="ml-3 flex-1 min-w-0 pr-16 overflow-hidden pl-[10px]">
                        <h4 className="text-[13px] font-medium text-gray-900 truncate">
                          {product.brand}
                        </h4>
                        <p 
                          className="text-[12px] text-gray-600 mb-1"
                          style={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-[#ff2742]">
                            {product.currency} {product.price.toLocaleString('id-ID')}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[11px] text-gray-400 line-through">
                              {product.currency} {product.originalPrice.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    
                    {/* Right: Buttons - absolutely positioned */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-gray-800" />
                      </button>
                      <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <Star className="w-5 h-5 text-gray-800" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
