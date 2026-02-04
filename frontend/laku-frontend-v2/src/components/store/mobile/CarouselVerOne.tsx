'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function CarouselVerOne({ images, height }: { images: string[]; height?: string | number }) {
  const [normalizedImages, setNormalizedImages] = useState<string[]>(images || []);

  useEffect(() => {
    if (!images || images.length === 0) return;
    setNormalizedImages(images);
  }, [images]);

  return (
    <div className="w-full overflow-hidden relative">
      <Swiper
        spaceBetween={12}
        slidesPerView={1}
        loop={normalizedImages.length > 1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        style={{ touchAction: 'pan-y' }}
      >
        {normalizedImages.map((src, i) => (
          <SwiperSlide key={i}>
            <div
              className={`rounded-lg overflow-hidden relative w-full ${!height ? 'h-72 sm:h-96' : ''}`}
              style={height ? { height: typeof height === 'number' ? `${height}px` : height } : undefined}
            >
              <Image src={src} alt={`slide-${i}`} fill className="object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
