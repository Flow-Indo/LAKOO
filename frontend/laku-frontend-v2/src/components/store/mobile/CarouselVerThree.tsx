'use client';

import React, { useEffect, useRef, useState } from 'react';
import { mockStore } from '@/lib/mock-store-data';

type ImageItem = string | { src: string; height?: number | string; y?: number | string };

type Props = {
  /** optional background image url - defaults to store banner */
  background?: string;
  /** list of image urls or objects { src, height } to show in the strip */
  images?: ImageItem[];
  /** height of the hero area (px or CSS value string like '60vh') */
  height?: number | string;
  /** animation duration in seconds */
  duration?: number;
  /** reverse autoplay direction when true */
  reverse?: boolean;
};

export default function CarouselVerThree({
  background,
  images: propImages,
  height = 520,
  duration = 5,
  reverse = false,
}: Props) {
  const images: ImageItem[] =
    propImages && propImages.length > 0
      ? propImages
      : (mockStore && mockStore.products ? mockStore.products.map(p => p.image) : []);
  const bg = background || (mockStore && mockStore.banner) || '';

  // base images and renderedImages (may be further duplicated at runtime to guarantee seamless loop)
  const baseImages = images;
  const [renderedImages, setRenderedImages] = useState<ImageItem[]>([...baseImages, ...baseImages]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef<number>(1); // 1 => forward (scrollLeft increasing), -1 => backward
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  // Toggle this if drag direction appears reversed on certain devices.
  // true means we treat a rightward pointer movement as increasing scrollLeft.
  const invertDrag = true;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Ensure enough content width to create a seamless loop. If the duplicated
    // set isn't wide enough (e.g. few/small images), append another copy until
    // the half-loop width exceeds the container width.
    const ensureLoopWidth = () => {
      if (!container) return;
      const halfWidth = container.scrollWidth / 2;
      if (halfWidth <= container.clientWidth && baseImages.length > 0) {
        // append another copy of baseImages
        setRenderedImages((prev) => [...prev, ...baseImages]);
        // re-measure on next frame after DOM updates
        requestAnimationFrame(ensureLoopWidth);
        return;
      }
    };
    requestAnimationFrame(ensureLoopWidth);

    // measure container height and keep updated
    const measure = () => setContainerHeight(container.clientHeight || null);
    measure();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(container);
    }

    // Ensure there's some scrollable width before starting
    const startAutoScroll = () => {
      lastTimeRef.current = null;
      const loop = (time: number) => {
        if (!container || isPaused || isDraggingRef.current) {
          lastTimeRef.current = time;
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        if (lastTimeRef.current == null) lastTimeRef.current = time;
        const delta = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // distance to move per ms so one full half-loop (one set of images) moves in `duration` seconds
        const loopDistance = container.scrollWidth / 2;
        if (loopDistance <= 0) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        const distancePerMs = loopDistance / (duration * 1000);
        const moveBy = distancePerMs * delta * (directionRef.current || 1) * (reverse ? -1 : 1);

        // Use modulo-style wrapping to avoid overshoot and visible ends:
        let newScroll = container.scrollLeft + moveBy;
        // normalize into [0, loopDistance)
        if (newScroll >= loopDistance) {
          newScroll = newScroll - loopDistance * Math.floor(newScroll / loopDistance);
        } else if (newScroll < 0) {
          // bring into positive range
          newScroll = loopDistance - (Math.abs(newScroll) % loopDistance);
          if (newScroll === loopDistance) newScroll = 0;
        }
        container.scrollLeft = newScroll;

        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    };

    startAutoScroll();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (ro) ro.disconnect();
    };
  }, [duration, isPaused, renderedImages.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      setIsPaused(true);
      (e.target as Element).setPointerCapture?.(e.pointerId);
      dragStartXRef.current = e.clientX;
      dragStartScrollRef.current = container.scrollLeft;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      // allow inverting on devices where gesture sign is flipped
      const effectiveDx = invertDrag ? dx : -dx;
      // apply reverse prop to drag so visual direction flips immediately when reverse is set
      const signedDx = effectiveDx * (reverse ? -1 : 1);
      // make swipe-right (signedDx>0) decrease scrollLeft so images move right
      container.scrollLeft = dragStartScrollRef.current - signedDx;
      // if user drags in a direction, update autoplay direction so when autoplay resumes it follows the swipe
      try {
        const threshold = 10;
        if (Math.abs(signedDx) > threshold) {
          // signedDx > 0 means user swiped right -> set autoplay to scrollLeft decreasing (-1)
          directionRef.current = signedDx > 0 ? -1 : 1;
        }
      } catch {}
    };
    const onPointerUp = (e: PointerEvent) => {
      isDraggingRef.current = false;
        // do not change autoplay direction on pointer up to avoid sudden reversal;
        // directionRef is already updated during pointer move.
      setIsPaused(false);
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {}
    };

    const onMouseEnter = () => setIsPaused(true);
    const onMouseLeave = () => setIsPaused(false);

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    // allow touch scrolling vertically while we handle horizontal drag
    container.style.touchAction = 'pan-y';

    // add pointerdown in capture phase so drags that start on child elements are still detected
    container.addEventListener('pointerdown', onPointerDown, { capture: true });
    // touch fallback for devices/browsers that don't emit pointer events reliably
    const onTouchStart = (te: TouchEvent) => {
      isDraggingRef.current = true;
      setIsPaused(true);
      dragStartXRef.current = te.touches[0].clientX;
      dragStartScrollRef.current = container.scrollLeft;
    };
    const onTouchEnd = (te: TouchEvent) => {
      // emulate pointer up behavior
      isDraggingRef.current = false;
      // do not change autoplay direction on touch end to avoid sudden reversal;
      // directionRef is already updated during touch move (if supported).
      setIsPaused(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    return () => {
      container.removeEventListener('pointerdown', onPointerDown, { capture: true } as any);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden" // ✅ add overflow-hidden
      style={{
        height: typeof height === 'number' ? `${height}px` : (height || '520px'),
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* centered strip container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-full px-0">
          <div
            ref={containerRef}
            className="relative carousel-strip overflow-x-scroll overflow-y-hidden" // ✅ allow horizontal scroll area
            style={{
              height: '100%', // ✅ full hero height (instead of 60%)
            }}
          >
            <div
              ref={trackRef}
              className="flex items-center gap-2"
              style={{
                width: 'max-content',
                display: 'inline-flex',
              }}
            >
              {renderedImages.map((item, idx) => {
                const src = typeof item === 'string' ? item : item.src;
  
                // resolve itemHeight: support px, % (relative to hero/container), or numbers
                let itemHeightRaw =
                  typeof item === 'object' && item.height
                    ? item.height
                    : typeof height === 'number'
                    ? `${Math.round((height as number) * 0.4)}px`
                    : '25vh';

                let resolvedItemHeight = itemHeightRaw;
                if (typeof itemHeightRaw === 'string' && itemHeightRaw.trim().endsWith('%') && containerHeight) {
                  const pct = parseFloat(itemHeightRaw);
                  if (!Number.isNaN(pct)) resolvedItemHeight = `${Math.round((pct / 100) * containerHeight)}px`;
                } else if (typeof itemHeightRaw === 'number' && containerHeight) {
                  // treat numeric heights as percent if <= 100, otherwise px
                  if (itemHeightRaw <= 100) {
                    resolvedItemHeight = `${Math.round((itemHeightRaw / 100) * containerHeight)}px`;
                  } else {
                    resolvedItemHeight = `${itemHeightRaw}px`;
                  }
                }
  
                const yOffset =
                  typeof item === 'object' && item.y
                    ? typeof item.y === 'number'
                      ? `${item.y}px`
                      : item.y
                    : '0%';
  
                const uniformItemWidth = typeof height === 'number' ? `${Math.round((height as number) * 0.4)}px` : '10vw';

                return (
                  <div
                    key={`${src}-${idx}`}
                    className="flex-shrink-0 inline-block"
                    style={{
                      width: 'auto',
                      height: '100%',
                      overflow: 'visible', // ✅ don't crop here; let the hero crop
                    }}
                  >
                    <img
                      src={src}
                      alt={`carousel-${idx}`}
                      className="object-contain"
                      style={{
                        display: 'block',
                        pointerEvents: 'auto',
                        height: 'auto',
                        maxHeight: resolvedItemHeight,
                        width: 'auto',
                        margin: '0 auto',
                        transform: `translateY(${yOffset})`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
  
      <style jsx>{`
        .carousel-strip::-webkit-scrollbar {
          display: none;
        }
        .carousel-strip {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
