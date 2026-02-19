'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

interface OutfitItem {
  image: string;
  caption: string;
}

const allOutfits: OutfitItem[] = [
  { image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk2.webp', caption: '🌴 Jakarta Summer Vibes' },
  { image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk3.webp', caption: '✨ Weekend Chill Mode' },
  { image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk.webp', caption: '💼 Office Glam' },
  { image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk2.webp', caption: '🏖️ Beach Day Ready' },
  { image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor1.webp', caption: '🌙 Date Night ✨' },
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

  // Initialize with 4 random outfits
  useEffect(() => {
    setSelectedOutfits(getRandomOutfits(allOutfits, 4));
  }, []);

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

  const handleRefresh = () => {
    // Shuffle all 4 positions with new random selection from 5 options
    const shuffled = getRandomOutfits(allOutfits, 4);
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
      <div className="flex overflow-x-auto gap-4 px-4 pb-2 pt-[10px] scrollbar-hide">
        {selectedOutfits.map((outfit, index) => (
          <div key={`${key}-${index}`} className="flex flex-col items-start gap-2 flex-shrink-0">
            <div className="w-[110px] h-[150px] rounded-lg overflow-hidden">
              <img
                src={outfit.image}
                alt={outfit.caption}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-700 font-medium whitespace-nowrap">{outfit.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
