'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

interface ProductImage {
  id: string;
  url: string;
  thumbnail?: string;
  alt?: string;
}

export default function ProductImageCarousel({ images }: { images: ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (activeIndex >= images.length) setActiveIndex(0);
  }, [images, activeIndex]);

  return (
    <div className="relative h-full w-full">
      <Swiper
        modules={[Pagination]}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        pagination={{
          clickable: true,
          bulletActiveClass: '!bg-white !w-6',
        }}
        className="w-full h-full"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={img.id}>
            <div className="relative w-full h-full">
              <Image
                src={img.url}
                alt={img.alt || `Gambar produk ${idx + 1}`}
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail row */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 via-black/40 to-transparent pt-6 pb-3 px-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => {
                  swiperRef.current?.slideTo(i);
                  setActiveIndex(i);
                }}
                className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden border-2 ${
                  i === activeIndex ? 'border-white scale-105' : 'border-white/30'
                }`}
              >
                <Image src={img.thumbnail || img.url} alt={img.alt || `thumb-${i}`} width={48} height={48} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
          {/* Image counter */}
          <div className="flex-shrink-0 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {activeIndex + 1}/{images.length}
          </div>
        </div>
      </div>
    </div>
  );
}

