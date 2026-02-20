
 'use client';

import React, { useState } from 'react';

const SHIRTS = [
  '/jeans/jean_mock_details/atasan1-removebg-preview.png',
  '/jeans/jean_mock_details/atasan2-removebg-preview.png',
];

const PANTS = [
  '/jeans/jean_mock_details/celana1-removebg-preview.png',
  '/jeans/jean_mock_details/celana2-removebg-preview.png',
];

export default function VirtualFit() {
  const [selectedShirt, setSelectedShirt] = useState<string>(SHIRTS[0]);
  const [selectedPants, setSelectedPants] = useState<string>(PANTS[0]);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const shirtRef = React.useRef<HTMLImageElement | null>(null);
  const pantsRef = React.useRef<HTMLImageElement | null>(null);
  const preservedAbsoluteRef = React.useRef<number | null>(null);
  const [shirtTop, setShirtTop] = useState<number | null>(null);
  const [pantsTop, setPantsTop] = useState<number | null>(null);
  const [loaded, setLoaded] = useState({ shirt: false, pants: false });
  const [pantsNudge, setPantsNudge] = useState<number>(-75);
  const [userNudged, setUserNudged] = useState<boolean>(false);

  const recomputePositions = React.useCallback(() => {
    const container = containerRef.current;
    const shirt = shirtRef.current;
    const pants = pantsRef.current;
    if (!container || !shirt || !pants) return;
    const cRect = container.getBoundingClientRect();
    const sRect = shirt.getBoundingClientRect();
    const pRect = pants.getBoundingClientRect();

    // shirt: place so its bottom sits at middle of container
    const middleY = cRect.height / 2;
    const shirtHeight = sRect.height;
    let targetShirtTop = middleY - shirtHeight;
    if (targetShirtTop < 0) targetShirtTop = 0;

    // pants: place so its top equals shirt bottom
    let targetPantsTop = targetShirtTop + shirtHeight;
    // clamp so pants not off top
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

  React.useEffect(() => {
    if (loaded.shirt && loaded.pants) recomputePositions();
  }, [loaded, recomputePositions, selectedShirt, selectedPants]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => recomputePositions());
      ro.observe(container);
    }
    window.addEventListener('resize', recomputePositions);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', recomputePositions);
    };
  }, [recomputePositions]);

  // enhanced positioning using content bbox ratios
  React.useEffect(() => {
    const run = async () => {
      const s = shirtRef.current;
      const p = pantsRef.current;
      const sBox = await computeContentRatios(s);
      const pBox = await computeContentRatios(p);
      if (sBox && pBox) {
        // compute based on rendered sizes
        const container = containerRef.current;
        if (!container) return;
        const middleY = container.clientHeight / 2;

        const sRenderedH = s ? s.clientHeight : 0;
        const pRenderedH = p ? p.clientHeight : 0;

        // shirt bottom content position (from top of shirt)
        const shirtContentBottom = sRenderedH * sBox.bottomRatio;
        const targetShirtTop = Math.max(0, middleY - shirtContentBottom);

        // pants top content offset within pants image
        const pantsContentTop = pRenderedH * pBox.topRatio;
        const targetPantsTop = Math.max(0, targetShirtTop + shirtContentBottom - pantsContentTop);

        // preserve visible pants position when the user hasn't manually nudged
        const prevAbsolute = (!userNudged && preservedAbsoluteRef.current != null)
          ? preservedAbsoluteRef.current
          : ((!userNudged && pantsTop != null) ? (pantsTop + pantsNudge) : null);

        setShirtTop(targetShirtTop);
        if (prevAbsolute != null) {
          setPantsTop(Math.max(0, prevAbsolute - pantsNudge));
          preservedAbsoluteRef.current = null;
        } else {
          setPantsTop(targetPantsTop);
        }
      }
    };
    // run when images change
    run();
  }, [selectedShirt, selectedPants, loaded.shirt, loaded.pants, userNudged, pantsNudge, pantsTop]);

  // vertical nudge control replaced with up/down arrow buttons
  const VerticalSlider = React.useCallback(
    ({ value, min, max, height = 160, onChange }: { value: number; min: number; max: number; height?: number; onChange: (v: number) => void }) => {
      const trackRef = React.useRef<HTMLDivElement | null>(null);
      const intervalRef = React.useRef<number | null>(null);

      const clampAndSet = React.useCallback(
        (v: number) => {
          let nv = v;
          if (nv > max) nv = max;
          if (nv < min) nv = min;
          onChange(nv);
        },
        [min, max, onChange]
      );

      const stepChange = React.useCallback(
        (delta: number) => {
          clampAndSet(value + delta);
        },
        [value, clampAndSet]
      );

      const startRepeat = React.useCallback((delta: number) => {
        stepChange(delta);
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => stepChange(delta), 120) as unknown as number;
      }, [stepChange]);

      const stopRepeat = React.useCallback(() => {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, []);

      React.useEffect(() => {
        return () => {
          stopRepeat();
        };
      }, [stopRepeat]);

      React.useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          // positive deltaY -> move pants down -> increase value
          const delta = Math.sign(e.deltaY) * Math.max(1, Math.round(Math.abs(e.deltaY) / 100));
          clampAndSet(value + delta);
        };
        track.addEventListener('wheel', onWheel, { passive: false });
        return () => track.removeEventListener('wheel', onWheel);
      }, [value, clampAndSet]);

      // Draggable vertical slider (custom thumb on rounded track)
      const thumbSize = 36;
      const trackHeight = typeof height === 'number' ? height : 160;
      const trackInner = Math.max(0, trackHeight - thumbSize);
      const frac = (value - min) / (max - min); // 0..1
      const topCenter = (1 - frac) * trackInner + thumbSize / 2;

      const thumbRef = React.useRef<HTMLDivElement | null>(null);
      const draggingRef = React.useRef(false);

      const pointerMove = React.useCallback(
        (e: PointerEvent) => {
          const track = trackRef.current;
          if (!track) return;
          const rect = track.getBoundingClientRect();
          let y = e.clientY - rect.top;
          // center coordinate
          y = Math.max(thumbSize / 2, Math.min(trackHeight - thumbSize / 2, y));
          const relative = (y - thumbSize / 2) / trackInner; // 0..1 from top to bottom
          const newFrac = 1 - relative; // invert so max is top
          const newValue = Math.round(min + newFrac * (max - min));
          clampAndSet(newValue);
        },
        [clampAndSet, min, max, trackHeight, trackInner]
      );

      const pointerUp = React.useCallback(() => {
        draggingRef.current = false;
        window.removeEventListener('pointermove', pointerMove as any);
        window.removeEventListener('pointerup', pointerUp as any);
      }, [pointerMove]);

      const startDrag = React.useCallback(
        (clientY: number) => {
          const track = trackRef.current;
          if (!track) return;
          draggingRef.current = true;
          window.addEventListener('pointermove', pointerMove as any);
          window.addEventListener('pointerup', pointerUp as any);
          // perform initial move
          pointerMove({ clientY } as PointerEvent);
        },
        [pointerMove, pointerUp]
      );

      const onTrackPointerDown = (e: React.PointerEvent) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        startDrag(e.clientY);
      };

      const onThumbPointerDown = (e: React.PointerEvent) => {
        e.stopPropagation();
        (e.target as Element).setPointerCapture?.(e.pointerId);
        startDrag(e.clientY);
      };

      return (
        <div
          ref={trackRef}
          style={{
            width: 40,
            height,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPointerDown={onTrackPointerDown}
        >
          {/* track */}
          <div
            style={{
              position: 'absolute',
              width: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              height: trackHeight,
              background: '#e6e6e6',
              borderRadius: 999,
              boxShadow: 'inset 0 2px 0 rgba(0,0,0,0.03)',
            }}
          />

          {/* thumb */}
          <div
            ref={thumbRef}
            onPointerDown={onThumbPointerDown}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              top: `${topCenter}px`,
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              background: '#fff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
            }}
          />
        </div>
      );
    },
    []
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {/* Preview */}
        <div className="col-span-1 md:col-span-2 rounded-lg bg-white shadow p-0 overflow-hidden">
          <div ref={containerRef} className="relative w-full" style={{ paddingTop: '120%', overflow: 'hidden', borderRadius: 8 }}>
            {/* pants overlay (position upper side touching middle) */}
            <img
              ref={pantsRef}
              src={selectedPants}
              alt="pants overlay"
              className="absolute left-1/2 object-contain"
              onLoad={() => setLoaded((s) => ({ ...s, pants: true }))}
              style={{
                width: '55%',
                height: 'auto',
                zIndex: 30,
                pointerEvents: 'none',
                top: pantsTop != null ? `${pantsTop + pantsNudge}px` : '50%',
                transform: 'translateX(-50%)',
              }}
            />

            {/* shirt overlay (position lower side touching middle) */}
            <img
              ref={shirtRef}
              src={selectedShirt}
              alt="shirt overlay"
              className="absolute left-1/2 object-contain"
              onLoad={() => setLoaded((s) => ({ ...s, shirt: true }))}
              style={{
                width: '50%',
                height: 'auto',
                zIndex: 40,
                pointerEvents: 'none',
                top: shirtTop != null ? `${shirtTop}px` : undefined,
                bottom: shirtTop == null ? '50%' : undefined,
                transform: 'translateX(-50%)',
              }}
            />

            {/* product name/price labels removed */}

            {/* pinned vertical slider inside preview (always visible) */}
            <div
              aria-hidden={false}
              className="absolute"
              style={{
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 60,
                width: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
              }}
            >
              <VerticalSlider
                min={-100}
                max={-30}
                value={pantsNudge}
                onChange={(v) => {
                  if (pantsTop != null) preservedAbsoluteRef.current = pantsTop + pantsNudge;
                  setPantsNudge(v);
                  setUserNudged(true);
                }}
                height={180}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="col-span-1 rounded-lg bg-white shadow p-0">
          <div>
            <h4 className="font-semibold mb-2">Tops</h4>
            <div className="flex gap-2 flex-wrap">
              {SHIRTS.map((src) => (
                <button
                  key={src}
                  onClick={() => {
                    if (pantsTop != null) preservedAbsoluteRef.current = pantsTop + pantsNudge;
                    setSelectedShirt(src);
                  }}
                  className={`border rounded overflow-hidden ${selectedShirt === src ? 'ring-2 ring-amber-300' : 'opacity-90'}`}
                >
                  <img src={src} alt={src} className="w-24 h-24 object-contain bg-white" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Pants</h4>
            <div className="flex gap-2 flex-wrap">
              {PANTS.map((src) => (
                <button
                  key={src}
                  onClick={() => {
                    if (pantsTop != null) preservedAbsoluteRef.current = pantsTop + pantsNudge;
                    setSelectedPants(src);
                  }}
                  className={`border rounded overflow-hidden ${selectedPants === src ? 'ring-2 ring-amber-300' : 'opacity-90'}`}
                >
                  <img src={src} alt={src} className="w-24 h-24 object-contain bg-white" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
