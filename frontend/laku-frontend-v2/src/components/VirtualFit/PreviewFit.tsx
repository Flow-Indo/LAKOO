'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

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
}

export default function PreviewFit({ shirts, pants, selectedShirtId, selectedPantId, onSelectShirt, onSelectPant }: Props) {
  const shirt = shirts.find(s => s.id === selectedShirtId) ?? shirts[0];
  const pant = pants.find(p => p.id === selectedPantId) ?? pants[0];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shirtRef = useRef<HTMLImageElement | null>(null);
  const pantsRef = useRef<HTMLImageElement | null>(null);

  const [loaded, setLoaded] = useState({ shirt: false, pants: false });

  const [shirtTop, setShirtTop] = useState<number | null>(null);
  const [pantsTop, setPantsTop] = useState<number | null>(null);
  const [pantsNudge, setPantsNudge] = useState<number>(-35);
  const preservedAbsoluteRef = useRef<number | null>(null);
  const [userNudged, setUserNudged] = useState<boolean>(false);
  const sliderIsDraggingRef = useRef<boolean>(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const MIN_NUDGE = -50;
  const MAX_NUDGE = -20;
  const NUDGE_STEP = 5;
  const [pantAbove, setPantAbove] = useState<boolean>(false);
  const pantsZ = pantAbove ? 40 : 30;
  const shirtZ = pantAbove ? 30 : 40;

  const recomputePositions = useCallback(() => {
    const container = containerRef.current;
    const sImg = shirtRef.current;
    const pImg = pantsRef.current;
    if (!container || !sImg || !pImg) return;
    const cRect = container.getBoundingClientRect();
    const sRect = sImg.getBoundingClientRect();
    const pRect = pImg.getBoundingClientRect();

    // shirt: place so its bottom sits at middle of container
    const middleY = cRect.height / 2;
    const shirtHeight = sRect.height;
    let targetShirtTop = middleY - shirtHeight;
    if (targetShirtTop < 0) targetShirtTop = 0;

    // pants: place so its top equals shirt bottom
    let targetPantsTop = targetShirtTop + shirtHeight;
    if (targetPantsTop < 0) targetPantsTop = 0;

    setShirtTop(targetShirtTop);
    setPantsTop(targetPantsTop);
  }, []);

  // compute content bbox (top and bottom) as ratios of natural height
  const computeContentRatios = async (imgEl: HTMLImageElement | null) => {
    if (!imgEl || !imgEl.naturalWidth || !imgEl.naturalHeight) return null;
    const w = imgEl.naturalWidth;
    const h = imgEl.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(imgEl, 0, 0, w, h);
    try {
      const data = ctx.getImageData(0, 0, w, h).data;
      let top = 0;
      let bottom = h - 1;
      // find top
      let foundTop = false;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const alpha = data[(y * w + x) * 4 + 3];
          if (alpha > 8) {
            top = y;
            foundTop = true;
            break;
          }
        }
        if (foundTop) break;
      }
      // find bottom
      let foundBottom = false;
      for (let y = h - 1; y >= 0; y--) {
        for (let x = 0; x < w; x++) {
          const alpha = data[(y * w + x) * 4 + 3];
          if (alpha > 8) {
            bottom = y;
            foundBottom = true;
            break;
          }
        }
        if (foundBottom) break;
      }
      return { topRatio: top / h, bottomRatio: bottom / h, naturalHeight: h };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (loaded.shirt && loaded.pants) recomputePositions();
  }, [loaded, recomputePositions, shirt, pant]);

  useEffect(() => {
    const run = async () => {
      const s = shirtRef.current;
      const p = pantsRef.current;
      const sBox = await computeContentRatios(s);
      const pBox = await computeContentRatios(p);
      if (sBox && pBox) {
        const container = containerRef.current;
        if (!container) return;
        const middleY = container.clientHeight / 2;

        const sRenderedH = s ? s.clientHeight : 0;
        const pRenderedH = p ? p.clientHeight : 0;

        const shirtContentBottom = sRenderedH * sBox.bottomRatio;
        const targetShirtTop = Math.max(0, middleY - shirtContentBottom);

        const pantsContentTop = pRenderedH * pBox.topRatio;
        const targetPantsTop = Math.max(0, targetShirtTop + shirtContentBottom - pantsContentTop);

        // Only reuse an explicitly preserved absolute position (set when user nudges).
        // Do NOT fall back to previous pantsTop + pantsNudge because that's stale when
        // switching items and the user didn't actually nudge.
        const prevAbsolute =
          (!userNudged && preservedAbsoluteRef.current != null)
            ? preservedAbsoluteRef.current
            : null;

        setShirtTop(targetShirtTop);
        if (prevAbsolute != null) {
          setPantsTop(Math.max(0, prevAbsolute - pantsNudge));
          preservedAbsoluteRef.current = null;
        } else {
          setPantsTop(targetPantsTop);
        }
      }
    };
    run();
  }, [shirt, pant, loaded.shirt, loaded.pants, userNudged, pantsTop]);

  // helpers for chevrons
  const currentShirtIndex = Math.max(0, shirts.findIndex(s => s.id === (selectedShirtId ?? shirt?.id)));
  const currentPantIndex = Math.max(0, pants.findIndex(p => p.id === (selectedPantId ?? pant?.id)));

  const prevShirt = () => {
    if (shirts.length === 0) return;
    const idx = (currentShirtIndex - 1 + shirts.length) % shirts.length;
    onSelectShirt(shirts[idx].id);
  };
  const nextShirt = () => {
    if (shirts.length === 0) return;
    const idx = (currentShirtIndex + 1) % shirts.length;
    onSelectShirt(shirts[idx].id);
  };
  const prevPant = () => {
    if (pants.length === 0) return;
    const idx = (currentPantIndex - 1 + pants.length) % pants.length;
    onSelectPant(pants[idx].id);
  };
  const nextPant = () => {
    if (pants.length === 0) return;
    const idx = (currentPantIndex + 1) % pants.length;
    onSelectPant(pants[idx].id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-2.5 bg-[#F7F7F7]">
      <div
        ref={containerRef}
        className="relative w-full h-[480px] bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden"
      >
        {/* pants overlay */}
        {pant && (
          <img
            ref={pantsRef}
            src={pant.src}
            alt={pant.name}
            onLoad={() => setLoaded((s) => ({ ...s, pants: true }))}
            className="absolute left-1/2 object-contain pointer-events-none"
            style={{
              width: '55%',
              height: 'auto',
              zIndex: pantsZ,
              top: pantsTop != null ? `${pantsTop + pantsNudge}px` : '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )}

        {/* shirt overlay */}
        {shirt && (
          <img
            ref={shirtRef}
            src={shirt.src}
            alt={shirt.name}
            onLoad={() => setLoaded((s) => ({ ...s, shirt: true }))}
            className="absolute left-1/2 object-contain pointer-events-none"
            style={{
              width: '55%',
              height: 'auto',
              zIndex: shirtZ,
              top: shirtTop != null ? `${shirtTop}px` : undefined,
              bottom: shirtTop == null ? '50%' : undefined,
              transform: 'translateX(-50%)',
            }}
          />
        )}
 
        {/* vertical nudger control (right) */}
        <div
          ref={sliderRef}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 flex items-center justify-center"
          style={{ height: '70%' }}
          onClick={(e) => {
            // click to set nearest step
            const el = sliderRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const y = (e as React.MouseEvent).clientY - rect.top;
            const ratio = y / rect.height;
            const raw = MIN_NUDGE + ratio * (MAX_NUDGE - MIN_NUDGE);
            const snapped = Math.round(raw / NUDGE_STEP) * NUDGE_STEP;
            setPantsNudge(snapped);
            setUserNudged(true);
          }}
        >
          {/* slider track */}
          <div className="relative h-full w-2 bg-transparent">
            {/* ticks */}
            {Array.from({ length: Math.floor((MAX_NUDGE - MIN_NUDGE) / NUDGE_STEP) + 1 }).map((_, idx) => {
              const value = MIN_NUDGE + idx * NUDGE_STEP;
              const percent = ((value - MIN_NUDGE) / (MAX_NUDGE - MIN_NUDGE)) * 100;
              const isActive = value === pantsNudge;
              return (
                <div
                  key={value}
                  className={`absolute left-0 w-6 -translate-x-full ${isActive ? 'bg-gray-500' : 'bg-gray-300'}`}
                  style={{ height: '1px', top: `${percent}%`, transform: 'translateY(-50%)' }}
                />
              );
            })}

            {/* knob */}
            <div
              role="slider"
              tabIndex={0}
              onMouseDown={(e) => {
                sliderIsDraggingRef.current = true;
                e.preventDefault();
                const onMove = (ev: MouseEvent) => {
                  const el = sliderRef.current;
                  if (!el) return;
                  const rect = el.getBoundingClientRect();
                  const y = ev.clientY - rect.top;
                  const ratio = Math.max(0, Math.min(1, y / rect.height));
                  const raw = MIN_NUDGE + ratio * (MAX_NUDGE - MIN_NUDGE);
                  const snapped = Math.round(raw / NUDGE_STEP) * NUDGE_STEP;
                  setPantsNudge(snapped);
                  setUserNudged(true);
                };
                const onUp = () => {
                  sliderIsDraggingRef.current = false;
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
              onTouchStart={(e) => {
                sliderIsDraggingRef.current = true;
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                const el = sliderRef.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const y = touch.clientY - rect.top;
                  const ratio = Math.max(0, Math.min(1, y / rect.height));
                  const raw = MIN_NUDGE + ratio * (MAX_NUDGE - MIN_NUDGE);
                  const snapped = Math.round(raw / NUDGE_STEP) * NUDGE_STEP;
                  setPantsNudge(snapped);
                setUserNudged(true);
              }}
              className="absolute left-0 -translate-x-full w-6 h-6 bg-white rounded-full border shadow-sm flex items-center justify-center"
              style={{
                top: `${((pantsNudge - MIN_NUDGE) / (MAX_NUDGE - MIN_NUDGE)) * 100}%`,
                transform: 'translateY(-50%) translateX(-50%)',
                zIndex: 50,
              }}
            />
          </div>
        </div>
      </div>

      {/* z-index toggle button removed */}

        {/* chevrons removed — swipe in OptionFit controls selection */}

        {/* product details removed per request */}
    </div>
  );
}

