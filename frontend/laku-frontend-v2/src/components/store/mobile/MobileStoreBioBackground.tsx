'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Store } from '@/types/store';

interface MobileStoreBioBackgroundProps {
  store: Store;
  expandedHeight?: number; // fallback 300
  children: React.ReactNode;
}

export function MobileStoreBioBackground({
  store,
  expandedHeight = 300,
  children,
}: MobileStoreBioBackgroundProps) {
  const [bgStyle, setBgStyle] = useState<Record<string, string> | undefined>(undefined);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Prefer banner/coverImage -> first product image -> logo
    const preferredStoreImage =
      (store as any)?.banner ||
      (store as any)?.coverImage ||
      store?.products?.[0]?.image ||
      store?.logo;

    const imageUrl = preferredStoreImage;
    if (!imageUrl || typeof window === 'undefined') return;

    const encodedImageUrl = encodeURI(imageUrl);

    let cancelled = false;

    const computeAverageColor = (url: string) =>
      new Promise<string>((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = url;

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const w = 50;
            const h = 50;
            canvas.width = w;
            canvas.height = h;

            if (!ctx) return resolve('rgba(0,0,0,0.6)');

            ctx.drawImage(img, 0, 0, w, h);
            const data = ctx.getImageData(0, 0, w, h).data;

            let r = 0;
            let g = 0;
            let b = 0;
            let count = 0;

            // sample every 4th pixel for speed
            for (let i = 0; i < data.length; i += 16) {
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              count++;
            }

            if (count === 0) return resolve('rgba(0,0,0,0.6)');

            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);

            resolve(`rgb(${r}, ${g}, ${b})`);
          } catch {
            resolve('rgba(0,0,0,0.6)');
          }
        };

        img.onerror = () => resolve('rgba(0,0,0,0.6)');
      });

    // show image instantly
    setBgStyle({
      backgroundImage: `url("${encodedImageUrl}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'rgba(0,0,0,0.12)',
    });

    (async () => {
      const dominant = await computeAverageColor(imageUrl);
      if (cancelled) return;

      setBgStyle({
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${dominant} 100%), url("${encodedImageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: dominant,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [store]);

  // Observe content size and apply its height to the background container.
  useEffect(() => {
    if (typeof window === 'undefined' || !contentRef.current) {
      // fallback to expandedHeight if content not available
      setHeight(expandedHeight);
      return;
    }

    const el = contentRef.current;

    const update = () => {
      // use offsetHeight/scrollHeight to capture full content height
      const measured = el.offsetHeight || el.scrollHeight || 0;
      setHeight(measured);
    };

    // initial measurement
    update();

    // listen for dynamic changes
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [expandedHeight]);

  return (
    <div
      ref={containerRef}
      className="relative px-4 pb-0 overflow-visible"
      style={{
        ...bgStyle,
        // apply measured height; if not measured yet, fallback to undefined so layout can size naturally
        height: typeof height === 'number' ? `${height}px` : undefined,
      }}
    >
      {/* black overlay (30%) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 pointer-events-none" />

      {/* content that we measure */}
      <div ref={contentRef} className="relative z-10 flex flex-col">
        {children}
      </div>
    </div>
  );
}
