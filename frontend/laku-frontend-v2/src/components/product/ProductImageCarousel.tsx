'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductImageCarouselProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="md:hidden relative -mx-4">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        onSlideChange={(swiper: SwiperType) => setCurrentSlide(swiper.activeIndex)}
        className="aspect-square"
        loop={images.length > 1}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id}>
            <div className="relative w-full h-full bg-gray-100">
              <Image
                src={image.url}
                alt={`${productName} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}