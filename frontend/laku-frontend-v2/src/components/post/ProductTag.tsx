'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface ProductTagProps {
  productName: string;
  productSlug: string;
  position: {
    x: number;
    y: number;
  };
  visible: boolean;
  isHidden?: boolean;
  onToggle?: () => void;
}

export default function ProductTag({
  productName,
  productSlug,
  position,
  visible,
  isHidden = false,
  onToggle
}: ProductTagProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Default expanded
  const [showOnLeft, setShowOnLeft] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && position.x > 50) {
      setShowOnLeft(true);
    } else {
      setShowOnLeft(false);
    }
  }, [isExpanded, position.x]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        onToggle?.();
      }
    };

    if (isExpanded && !isHidden) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isExpanded, isHidden, onToggle]);

  // Hide when isHidden is true
  if (!visible || isHidden) return null;

  return (
    <div
      ref={tagRef}
      className="absolute z-20 pointer-events-auto"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Dot Indicator - Smaller */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="relative w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center group hover:bg-white transition-all z-10"
      >
        <ShoppingBag className="w-3 h-3 text-gray-800" />

        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" />
      </button>

      {/* Expanded Tag - Positioned exactly beside the dot */}
      {isExpanded && (
        <div
          className="absolute top-1/2 z-20"
          style={{
            // Dot is 24px (w-6), so radius is 12px from center
            // Position the tag box to start from the edge of the dot (12px) + 4px gap = 16px from center
            transform: showOnLeft
              ? 'translateY(-50%) translateX(calc(-100% - 10px))' // Left: dot edge - 4px gap
              : 'translateY(-50%) translateX(30px)' // Right: dot edge + 4px gap
          }}
        >
          <Link
            href={`/product/${productSlug}`}
            className="flex items-center gap-1.5 bg-gray-800/95 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg shadow-lg hover:bg-gray-900 transition-all whitespace-nowrap max-w-[180px]"
            onClick={(e) => e.stopPropagation()}
          >
            <ShoppingBag className="w-3 h-3 flex-shrink-0" />
            <span className="text-[11px] font-medium truncate">
              {productName}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
