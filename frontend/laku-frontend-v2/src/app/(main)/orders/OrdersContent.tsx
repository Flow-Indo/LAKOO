 'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import OrdersSemua from './OrdersSemua';
import OrdersBelumBayar from './OrdersBelumBayar';
import OrdersDikemas from './OrdersDikemas';
import OrdersDikirim from './OrdersDikirim';
import OrdersSelesai from './OrdersSelesai';
import OrdersPengembalian from './OrdersPengembalian';

const TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'toPay', label: 'Belum Bayar' },
  { key: 'toShip', label: 'Dikemas' },
  { key: 'toReceive', label: 'Dikirim' },
  { key: 'completed', label: 'Selesai' },
  { key: 'returns', label: 'Pengembalian' },
];

function statusToIndex(status: string) {
  const idx = TABS.findIndex((t) => t.key === status);
  return idx === -1 ? 0 : idx;
}

export default function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get('status') || 'all';
  const [activeIndex, setActiveIndex] = useState<number>(statusToIndex(initialStatus));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollEndTimeoutRef = useRef<number | null>(null);
  const prevSnapRef = useRef<string | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const animDelayTimeoutRef = useRef<number | null>(null);
  const SCROLL_END_DEBOUNCE = 550;
  const ANIM_DURATION = 420;

  useEffect(() => {
    // Sync activeIndex when URL changes
    const status = searchParams?.get('status') || 'all';
    setActiveIndex(statusToIndex(status));
    // also ensure scroll position matches
    const el = containerRef.current;
    if (el) {
      const target = Math.round(statusToIndex(status) * el.clientWidth);
      el.scrollTo({ left: target, behavior: 'auto' });
    }
  }, [searchParams]);

  const goTo = (key: string, index?: number) => {
    const el = containerRef.current;
    if (el && typeof index === 'number') {
      // mark that this scroll was initiated programmatically to avoid onScroll url updates
      isProgrammaticScrollRef.current = true;
      // temporarily disable scroll snapping and pointer events to avoid layout flinch
      prevSnapRef.current = el.style.scrollSnapType || '';
      el.style.scrollSnapType = 'none';
      el.style.pointerEvents = 'none';
      const target = Math.round(index * el.clientWidth);
      // cancel any running animation or delay
      if (animDelayTimeoutRef.current) {
        window.clearTimeout(animDelayTimeoutRef.current);
        animDelayTimeoutRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      // force layout flush so the browser finishes pending layout before animation
      el.getBoundingClientRect();

      // tiny delay to allow layout/paint to settle, then start rAF animation
      animDelayTimeoutRef.current = window.setTimeout(() => {
        animDelayTimeoutRef.current = null;
        // smooth scroll via requestAnimationFrame (avoids browser sub-pixel / tilt issues)
        const duration = 420;
        const start = el.scrollLeft;
        const change = target - start;
        const startTime = performance.now();
        const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
        const step = (now: number) => {
          const t = Math.min(1, (now - startTime) / duration);
          el.scrollLeft = Math.round(start + change * easeInOutQuad(t));
          if (t < 1) {
            animFrameRef.current = requestAnimationFrame(step);
          } else {
            animFrameRef.current = null;
          }
        };
        animFrameRef.current = requestAnimationFrame(step);
      }, 15);
      setActiveIndex(index);

      // debounce URL update until scroll settles and then restore snap/pointer styles
      if (typeof window !== 'undefined') {
        if (scrollEndTimeoutRef.current) {
          window.clearTimeout(scrollEndTimeoutRef.current);
        }
        scrollEndTimeoutRef.current = window.setTimeout(() => {
          const url = key === 'all' ? '/orders' : `/orders?status=${key}`;
          try {
            router.replace(url, { scroll: false });
          } catch {
            router.push(url);
          }
          isProgrammaticScrollRef.current = false;
          // restore previous snap behavior and pointer events
          el.style.scrollSnapType = prevSnapRef.current || 'x mandatory';
          el.style.pointerEvents = '';
          scrollEndTimeoutRef.current = null;
        }, Math.max(SCROLL_END_DEBOUNCE, ANIM_DURATION + 80));
      }
    } else {
      const url = key === 'all' ? '/orders' : `/orders?status=${key}`;
      try {
        router.replace(url, { scroll: false });
      } catch {
        router.push(url);
      }
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      if (idx !== activeIndex) {
        setActiveIndex(idx);
        const key = TABS[idx]?.key ?? 'all';
        const url = key === 'all' ? '/orders' : `/orders?status=${key}`;
        // if user scrolled manually, update URL immediately; otherwise ignore because goTo handles it
        if (!isProgrammaticScrollRef.current) {
          router.replace(url, { scroll: false });
        }
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [activeIndex, router]);

  return (
    <>
      <div className="mt-4">
        <div className="rounded-t-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar flex-nowrap">
              {TABS.map((tab, i) => (
                <button
                  key={tab.key}
                  onClick={() => goTo(tab.key, i)}
                  className={`flex flex-col items-center pb-2 text-sm ${activeIndex === i ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <div
                    className={`mt-2 rounded-full ${activeIndex === i ? 'bg-red-600' : 'bg-transparent'}`}
                    style={{ width: activeIndex === i ? 28 : 28, height: 4 }}
                  />
                </button>
              ))}
            </div>
            <div className="text-gray-400 text-sm"> </div>
          </div>

          <div
            ref={containerRef}
            className="w-full overflow-x-auto snap-x snap-mandatory flex gap-4"
            style={{ scrollSnapType: 'x mandatory' } as React.CSSProperties}
          >
            <div className="min-w-full snap-start">
              <div
                className="w-full min-h-[300px] flex flex-col items-center justify-center p-4"
                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' } as React.CSSProperties}
              >
                <OrdersSemua label={TABS[0].label} />
              </div>
            </div>
            <div className="min-w-full snap-start">
              <div
                className="w-full min-h-[300px] flex flex-col items-center justify-center p-4"
                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' } as React.CSSProperties}
              >
                <OrdersBelumBayar label={TABS[1].label} />
              </div>
            </div>
            <div className="min-w-full snap-start">
              <div
                className="w-full min-h-[300px] flex flex-col items-center justify-center p-4"
                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' } as React.CSSProperties}
              >
                <OrdersDikemas label={TABS[2].label} />
              </div>
            </div>
            <div className="min-w-full snap-start">
              <div
                className="w-full min-h-[300px] flex flex-col items-center justify-center p-4"
                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' } as React.CSSProperties}
              >
                <OrdersDikirim label={TABS[3].label} />
              </div>
            </div>
            <div className="min-w-full snap-start">
              <div
                className="w-full min-h-[300px] flex flex-col items-center justify-center p-4"
                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' } as React.CSSProperties}
              >
                <OrdersSelesai label={TABS[4].label} />
              </div>
            </div>
            <div className="min-w-full snap-start">
              <div
                className="w-full min-h-[300px] flex flex-col items-center justify-center p-4"
                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' } as React.CSSProperties}
              >
                <OrdersPengembalian label={TABS[5].label} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

