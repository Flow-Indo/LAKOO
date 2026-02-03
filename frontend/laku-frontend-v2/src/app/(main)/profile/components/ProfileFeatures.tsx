'use client';

import React, { useRef, useState, useEffect } from 'react';
import ProfilePosts from './ProfilePosts';
import ProfileSaves from './ProfileSaves';
import ProfileLikes from './ProfileLikes';

const TABS = ['Posts', 'Saves', 'Likes'];

export default function ProfileFeatures() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActive(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
    setActive(index);
  };

  return (
    <div className="mt-4">
      <div className="rounded-t-2xl bg-white shadow-md border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => goTo(i)}
                className={`flex flex-col items-center pb-2 text-sm ${active === i ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}
              >
                <span>{t}</span>
                <div
                  className={`mt-2 rounded-full ${active === i ? 'bg-red-600' : 'bg-transparent'}`}
                  style={{ width: active === i ? 28 : 28, height: 4 }}
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
            <div className="w-full min-h-[300px] flex flex-col items-center justify-center p-0">
              <ProfilePosts />
            </div>
          </div>
          <div className="min-w-full snap-start">
            <div className="w-full min-h-[300px] flex flex-col items-center justify-center p-0">
              <ProfileSaves />
            </div>
          </div>
          <div className="min-w-full snap-start">
            <div className="w-full min-h-[300px] flex flex-col items-center justify-center p-0">
              <ProfileLikes />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

