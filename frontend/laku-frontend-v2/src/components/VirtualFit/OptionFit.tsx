'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Trash2, ChevronRight } from 'lucide-react';
import SeeAllPopUp from './SeeAllPopUp';

type FitProduct = {
  id: string;
  src: string;
  name: string;
  variation?: string;
  price: number;
  originalPrice?: number;
};

interface Props {
  shirts: FitProduct[];
  pants: FitProduct[];
  selectedShirtId?: string;
  selectedPantId?: string;
  onSelectShirt: (id: string) => void;
  onSelectPant: (id: string) => void;
  // selection mode props (managed by parent)
  selectMode?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onRemoveProduct?: (type: 'shirt' | 'pant', id: string) => void;
  onPopupOpenChange?: (open: boolean) => void;
}

export default function OptionFit({
  shirts,
  pants,
  selectedShirtId,
  selectedPantId,
  onSelectShirt,
  onSelectPant,
  selectMode = false,
  selectedIds = [],
  onToggleSelect,
  onRemoveProduct,
  onPopupOpenChange,
}: Props) {
  const selectedShirt = shirts.find(s => s.id === selectedShirtId) ?? shirts[0];
  const selectedPant = pants.find(p => p.id === selectedPantId) ?? pants[0];
  const [showAllTops, setShowAllTops] = useState<boolean>(false);
  const [showAllPants, setShowAllPants] = useState<boolean>(false);
  const [removingIds, setRemovingIds] = useState<string[]>([]);
 
  useEffect(() => {
    onPopupOpenChange?.(showAllTops || showAllPants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAllTops, showAllPants]);

  const rootRef = useRef<HTMLElement | null>(null);

  function findScrollParent(startEl: HTMLElement | null): HTMLElement | null {
    let el = startEl?.parentElement ?? null;
    while (el && el !== document.body && el !== document.documentElement) {
      try {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') && el.scrollHeight > el.clientHeight) {
          return el;
        }
      } catch {
        // ignore
      }
      el = el.parentElement;
    }
    return null;
  }
 

  // Implement continuous carousel per row using tripled slides (like CarouselVerOne)
  const shirtInnerRef = useRef<HTMLDivElement | null>(null);
  const pantInnerRef = useRef<HTMLDivElement | null>(null);

  // shirt carousel state/refs
  const shirtSlides = shirts.length ? [...shirts, ...shirts, ...shirts] : [];
  const shirtMid = shirts.length;
  const [shirtIndex, setShirtIndex] = useState(shirtMid);
  const shirtIsDraggingRef = useRef(false);
  const shirtStartXRef = useRef(0);
  const shirtCurrentTranslate = useRef(0);
  const shirtPrevTranslate = useRef(0);
  const shirtSkipTransitionRef = useRef(false);

  // pant carousel state/refs
  const pantSlides = pants.length ? [...pants, ...pants, ...pants] : [];
  const pantMid = pants.length;
  const [pantIndex, setPantIndex] = useState(pantMid);
  const pantIsDraggingRef = useRef(false);
  const pantStartXRef = useRef(0);
  const pantCurrentTranslate = useRef(0);
  const pantPrevTranslate = useRef(0);
  const pantSkipTransitionRef = useRef(false);

  function getWidth(el?: HTMLElement | null) {
    return el ? el.clientWidth : 0;
  }

  // set position helpers
  function setShirtPositionByIndex(animate = true) {
    const width = getWidth(shirtInnerRef.current?.parentElement ?? null);
    shirtCurrentTranslate.current = -shirtIndex * width;
    shirtPrevTranslate.current = shirtCurrentTranslate.current;
    if (shirtInnerRef.current) {
      shirtInnerRef.current.style.transition = animate ? 'transform 300ms ease' : 'none';
      shirtInnerRef.current.style.transform = `translateX(${shirtCurrentTranslate.current}px)`;
    }
  }

  // Prevent empty slides when only 1 item remains: clamp index to middle copy
  useEffect(() => {
    if (shirts.length === 0) return;
    if (shirts.length === 1) {
      // reset index to middle copy and snap without animation
      const midIndex = shirtMid;
      setShirtIndex(midIndex);
      shirtSkipTransitionRef.current = true;
      setTimeout(() => setShirtPositionByIndex(false), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shirts.length]);

  function setPantPositionByIndex(animate = true) {
    const width = getWidth(pantInnerRef.current?.parentElement ?? null);
    pantCurrentTranslate.current = -pantIndex * width;
    pantPrevTranslate.current = pantCurrentTranslate.current;
    if (pantInnerRef.current) {
      pantInnerRef.current.style.transition = animate ? 'transform 300ms ease' : 'none';
      pantInnerRef.current.style.transform = `translateX(${pantCurrentTranslate.current}px)`;
    }
  }

  // shirt touch/mouse handlers
  function shirtTouchStart(clientX: number) {
    if (shirts.length <= 1) return;
    shirtStartXRef.current = clientX;
    shirtIsDraggingRef.current = true;
    // sync previous translate to current to avoid jump when starting a drag
    shirtPrevTranslate.current = shirtCurrentTranslate.current;
    if (shirtInnerRef.current) shirtInnerRef.current.style.transition = 'none';
  }

  function shirtTouchMove(clientX: number) {
    if (shirts.length <= 1) return;
    if (!shirtIsDraggingRef.current) return;
    const width = getWidth(shirtInnerRef.current?.parentElement ?? null);
    const dx = clientX - shirtStartXRef.current;
    shirtCurrentTranslate.current = shirtPrevTranslate.current + dx;
    if (shirtInnerRef.current) {
      shirtInnerRef.current.style.transform = `translateX(${shirtCurrentTranslate.current}px)`;
    }
  }

  function shirtTouchEnd() {
    if (shirts.length <= 1) {
      shirtIsDraggingRef.current = false;
      return;
    }
    if (!shirtIsDraggingRef.current) return;
    shirtIsDraggingRef.current = false;
    const width = getWidth(shirtInnerRef.current?.parentElement ?? null) || window.innerWidth;
    const moved = shirtCurrentTranslate.current - shirtPrevTranslate.current;
    // moved is negative when swiped left
    if (Math.abs(moved) < width / 4) {
      setShirtPositionByIndex(true);
      return;
    }
    if (moved < 0) {
      setShirtIndex((i) => i + 1);
    } else {
      setShirtIndex((i) => i - 1);
    }
  }

  // pant touch/mouse handlers
  function pantTouchStart(clientX: number) {
    if (pants.length <= 1) return;
    pantStartXRef.current = clientX;
    pantIsDraggingRef.current = true;
    // sync previous translate to current to avoid jump when starting a drag
    pantPrevTranslate.current = pantCurrentTranslate.current;
    if (pantInnerRef.current) pantInnerRef.current.style.transition = 'none';
  }

  function pantTouchMove(clientX: number) {
    if (pants.length <= 1) return;
    if (!pantIsDraggingRef.current) return;
    const dx = clientX - pantStartXRef.current;
    pantCurrentTranslate.current = pantPrevTranslate.current + dx;
    if (pantInnerRef.current) {
      pantInnerRef.current.style.transform = `translateX(${pantCurrentTranslate.current}px)`;
    }
  }

  function pantTouchEnd() {
    if (pants.length <= 1) {
      pantIsDraggingRef.current = false;
      return;
    }
    if (!pantIsDraggingRef.current) return;
    pantIsDraggingRef.current = false;
    const width = getWidth(pantInnerRef.current?.parentElement ?? null) || window.innerWidth;
    const moved = pantCurrentTranslate.current - pantPrevTranslate.current;
    if (Math.abs(moved) < width / 4) {
      setPantPositionByIndex(true);
      return;
    }
    if (moved < 0) {
      setPantIndex((i) => i + 1);
    } else {
      setPantIndex((i) => i - 1);
    }
  }

  // effect: position updates when index changes
  useEffect(() => {
    if (shirtSlides.length === 0) return;
    if (shirtSkipTransitionRef.current) {
      setShirtPositionByIndex(false);
      shirtSkipTransitionRef.current = false;
    } else {
      setShirtPositionByIndex(true);
    }
    // notify parent of current selection
    if (shirts.length > 0) {
      const realIndex = ((shirtIndex - shirtMid) % shirtMid + shirtMid) % shirtMid;
      if (shirts[realIndex]) onSelectShirt(shirts[realIndex].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shirtIndex]);

  useEffect(() => {
    if (pantSlides.length === 0) return;
    if (pantSkipTransitionRef.current) {
      setPantPositionByIndex(false);
      pantSkipTransitionRef.current = false;
    } else {
      setPantPositionByIndex(true);
    }
    if (pants.length > 0) {
      const realIndex = ((pantIndex - pantMid) % pantMid + pantMid) % pantMid;
      if (pants[realIndex]) onSelectPant(pants[realIndex].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pantIndex]);

  // sync when external selected id changes
  useEffect(() => {
    if (shirts.length === 0) return;
    const idx = Math.max(0, shirts.findIndex(s => s.id === selectedShirtId));
    setShirtIndex(shirtMid + idx);
    shirtSkipTransitionRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShirtId, shirts.length]);

  useEffect(() => {
    if (pants.length === 0) return;
    const idx = Math.max(0, pants.findIndex(p => p.id === selectedPantId));
    setPantIndex(pantMid + idx);
    pantSkipTransitionRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPantId, pants.length]);

  return (
    <>
    <section ref={rootRef} className="max-w-7xl mx-auto px-4 py-2.5 bg-[#F7F7F7] grid grid-cols-1 gap-1">
      <div className="w-full overflow-hidden">
        <div
          ref={shirtInnerRef}
          className="flex"
          onTouchStart={(e) => shirtTouchStart(e.touches[0].clientX)}
          onTouchMove={(e) => shirtTouchMove(e.touches[0].clientX)}
          onTouchEnd={shirtTouchEnd}
          onMouseDown={(e) => shirtTouchStart(e.clientX)}
          onMouseMove={(e) => {
            if (shirtIsDraggingRef.current) shirtTouchMove(e.clientX);
          }}
          onMouseUp={shirtTouchEnd}
          onMouseLeave={() => {
            if (shirtIsDraggingRef.current) shirtTouchEnd();
          }}
          style={{ touchAction: 'pan-y' }}
        >
          {shirtSlides.map((s, i) => {
            return (
              <div key={i} className="w-full flex-shrink-0">
                <div
                  className={`grid grid-cols-[80px_1fr] items-center gap-4 py-2 pl-4 pr-4 transition-all duration-300 ${selectMode && selectedIds.includes(s.id) ? 'bg-gray-100' : 'bg-white'} rounded-lg ${removingIds.includes(s.id) ? '-translate-x-full opacity-0 pointer-events-none' : ''} ${selectMode ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (selectMode && onToggleSelect) onToggleSelect(s.id);
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-20 h-20 rounded border p-2 flex items-center justify-center bg-white ${s.id === selectedShirtId ? 'ring-2 ring-amber-300' : ''}`}
                    >
                      <img src={s.src} alt={s.name} className="object-contain w-full h-full" />
                    </div>
                  </div>
                  <div className="w-[300px] flex items-center">
                  <div className="relative w-full h-20" style={{ fontSize: '14px' }}>
                      <div className="text-sm font-bold text-gray-900">{s.name}</div>
                      <div className="text-sm text-gray-600">{s.variation}</div>
                      <div className="text-red-600 font-semibold">Rp{s.price?.toLocaleString()}</div>
                      <div className="mt-2">
                        <button
                          type="button"
                          className="text-sm text-gray-600 font-normal inline-flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllTops(true);
                          }}
                        >
                          <span>See All</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <div
          ref={pantInnerRef}
          className="flex"
          onTouchStart={(e) => pantTouchStart(e.touches[0].clientX)}
          onTouchMove={(e) => pantTouchMove(e.touches[0].clientX)}
          onTouchEnd={pantTouchEnd}
          onMouseDown={(e) => pantTouchStart(e.clientX)}
          onMouseMove={(e) => {
            if (pantIsDraggingRef.current) pantTouchMove(e.clientX);
          }}
          onMouseUp={pantTouchEnd}
          onMouseLeave={() => {
            if (pantIsDraggingRef.current) pantTouchEnd();
          }}
          style={{ touchAction: 'pan-y' }}
        >
          {pantSlides.map((p, i) => {
            return (
              <div key={i} className="w-full flex-shrink-0">
                <div
                  className={`grid grid-cols-[80px_1fr] items-center gap-4 py-2 pl-4 pr-4 transition-all duration-300 ${selectMode && selectedIds.includes(p.id) ? 'bg-gray-100' : 'bg-white'} rounded-lg ${removingIds.includes(p.id) ? '-translate-x-full opacity-0 pointer-events-none' : ''} ${selectMode ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (selectMode && onToggleSelect) onToggleSelect(p.id);
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-20 h-20 rounded border p-2 flex items-center justify-center bg-white ${p.id === selectedPantId ? 'ring-2 ring-amber-300' : ''}`}
                    >
                      <img src={p.src} alt={p.name} className="object-contain w-full h-full" />
                    </div>
                  </div>
                  <div className="w-[300px] flex items-center">
                    <div className="relative w-full h-20" style={{ fontSize: '14px' }}>
                      <div className="text-sm font-bold text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-600">{p.variation}</div>
                      <div className="text-red-600 font-semibold">Rp{p.price?.toLocaleString()}</div>
                      <div className="mt-2">
                        <button
                          type="button"
                          className="text-sm text-gray-600 font-normal inline-flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllPants(true);
                          }}
                        >
                          <span>See All</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    <SeeAllPopUp
      open={showAllTops}
      title="All Tops"
      items={shirts}
      onClose={() => setShowAllTops(false)}
      onSelect={(id: string) => {
        onSelectShirt(id);
        setShowAllTops(false);
      }}
      onRemove={(id: string) => onRemoveProduct?.('shirt', id)}
      itemType="shirt"
    />
    <SeeAllPopUp
      open={showAllPants}
      title="All Pants"
      items={pants}
      onClose={() => setShowAllPants(false)}
      onSelect={(id: string) => {
        onSelectPant(id);
        setShowAllPants(false);
      }}
      onRemove={(id: string) => onRemoveProduct?.('pant', id)}
      itemType="pant"
    />
    </>
  );
}

