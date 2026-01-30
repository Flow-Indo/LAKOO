 'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

export default function CarouselVerOne({ images, height }: { images: string[]; height?: string | number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // use tripled slides to allow smooth infinite scroll in both directions
  const slides = images.length ? [...images, ...images, ...images] : [];
  const mid = images.length;
  const [index, setIndex] = useState(mid); // start at first real slide in middle block
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const skipTransitionRef = useRef(false);

  useEffect(() => {
    // position on mount / index change
    if (skipTransitionRef.current) {
      setPositionByIndex(false);
      skipTransitionRef.current = false;
    } else {
      setPositionByIndex(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function getWidth() {
    return containerRef.current ? containerRef.current.clientWidth : 0;
  }

  function setPositionByIndex(animate = true) {
    const width = getWidth();
    currentTranslate.current = -index * width;
    prevTranslate.current = currentTranslate.current;
    if (containerRef.current) {
      containerRef.current.style.transition = animate ? 'transform 300ms ease' : 'none';
      containerRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
    }
  }

  function touchStart(clientX: number) {
    startX.current = clientX;
    setIsDragging(true);
    if (containerRef.current) containerRef.current.style.transition = 'none';
  }

  function touchMove(clientX: number) {
    if (!isDragging) return;
    const dx = clientX - startX.current;
    currentTranslate.current = prevTranslate.current + dx;
    if (containerRef.current) containerRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  }

  function touchEnd() {
    setIsDragging(false);
    const width = getWidth();
    const movedBy = currentTranslate.current - prevTranslate.current;
    if (movedBy < -width * 0.2) {
      // move to next slide
      setIndex((i) => i + 1);
    } else if (movedBy > width * 0.2) {
      // move to prev slide
      setIndex((i) => i - 1);
    } else {
      setPositionByIndex(true);
    }
  }

  useEffect(() => {
    const handleResize = () => setPositionByIndex(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle wrapping snap when reaching cloned slides
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onTransitionEnd() {
      // if we've moved into left block, jump forward by mid
      if (index < mid) {
        skipTransitionRef.current = true;
        setIndex(index + mid);
      }
      // if we've moved into right block, jump backward by mid
      if (index >= mid * 2) {
        skipTransitionRef.current = true;
        setIndex(index - mid);
      }
    }
    el.addEventListener('transitionend', onTransitionEnd);
    return () => el.removeEventListener('transitionend', onTransitionEnd);
  }, [index, slides.length]);

  // autoplay: advance right every 4 seconds when not dragging
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => {
      if (!isDragging) {
        setIndex((i) => i + 1);
      }
    }, 4000);
    return () => clearInterval(id);
  }, [isDragging, images.length]);

  return (
    <div className="w-full overflow-hidden relative">
      <div
        className="flex"
        ref={containerRef}
        onTouchStart={(e) => touchStart(e.touches[0].clientX)}
        onTouchMove={(e) => touchMove(e.touches[0].clientX)}
        onTouchEnd={touchEnd}
        onMouseDown={(e) => touchStart(e.clientX)}
        onMouseMove={(e) => {
          if (isDragging) touchMove(e.clientX);
        }}
        onMouseUp={touchEnd}
        onMouseLeave={() => {
          if (isDragging) touchEnd();
        }}
        style={{ touchAction: 'pan-y' }}
      >
        {slides.map((src, i) => (
          <div key={i} className="w-full flex-shrink-0">
            <div
              className={`rounded-lg overflow-hidden relative w-full ${!height ? 'h-72 sm:h-96' : ''}`}
              style={height ? { height: typeof height === 'number' ? `${height}px` : height } : undefined}
            >
              <Image src={src} alt={`slide-${i}`} fill className="object-cover" />
            </div>
          </div>
        ))}
      </div>

     

      {/* indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => {
          const active = ((index - mid) % mid + mid) % mid === i;
          return (
            <button
              key={i}
              onClick={() => setIndex(mid + i)}
              className={`w-2 h-2 rounded-full ${active ? 'bg-orange-500' : 'bg-orange-500/30'}`}
            />
          );
        })}
      </div>
    </div>
  );
}

