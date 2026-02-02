 'use client';

 import React, { useEffect, useState } from 'react';
 import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
// register modules dynamically to avoid build-time import issues
import { useEffect as useEf } from 'react';
 import 'swiper/css';
 import 'swiper/css/pagination';

 export default function CarouselVerOne({ images, height }: { images: string[]; height?: string | number }) {
   const [normalizedImages, setNormalizedImages] = useState<string[]>(images || []);

  useEffect(() => {
    if (!images || images.length === 0) return;
    setNormalizedImages(images);
  }, [images]);

  useEf(() => {
    // dynamically register swiper modules at runtime
    let mounted = true;
    (async () => {
      try {
        const mod = await import('swiper');
        const Autoplay = (mod as any).Autoplay || (await import('swiper/modules/autoplay/autoplay')).Autoplay;
        const Pagination = (mod as any).Pagination || (await import('swiper/modules/pagination/pagination')).Pagination;
        const SwiperCore = (mod as any).default || mod;
        if (mounted && SwiperCore && Autoplay && Pagination) {
          SwiperCore.use([Autoplay, Pagination]);
        }
      } catch (e) {
        // ignore dynamic import errors
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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

