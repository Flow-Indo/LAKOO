 'use client';

 import React from 'react';
 import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect as useEf } from 'react';
 import 'swiper/css';
 import 'swiper/css/free-mode';

 type ImageItem = string | { src: string; height?: number | string; y?: number | string };

 type Props = {
   background?: string;
   images?: ImageItem[];
   height?: number | string;
   duration?: number;
   reverse?: boolean;
 };

 export default function CarouselVerThree({
   background,
   images: propImages,
   height = 520,
   duration = 5,
   reverse = false,
 }: Props) {
   const images: ImageItem[] = propImages && propImages.length > 0 ? propImages : [];
   const bg = background || '';

   return (
     <div
       className="relative w-full rounded-lg overflow-hidden"
       style={{
         height: typeof height === 'number' ? `${height}px` : (height || '520px'),
         backgroundImage: `url(${bg})`,
         backgroundRepeat: 'no-repeat',
         backgroundSize: 'cover',
         backgroundPosition: 'center',
       }}
     >
       <div className="absolute inset-0 flex items-center">
        {/* dynamically register swiper modules and render swiper */}
        <div className="w-full" style={{ touchAction: 'pan-y' }}>
          <DynamicSwiper images={images} duration={duration} />
        </div>
       </div>
     </div>
   );
 }

// Dynamic Swiper wrapper to avoid static module import issues
function DynamicSwiper({ images, duration }: { images: any[]; duration?: number }) {
  const [LoadedSwiper, setLoadedSwiper] = React.useState<any>(null);
  useEf(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('swiper/react');
        const Swiper = mod.Swiper;
        const SwiperSlide = mod.SwiperSlide;
        const core = await import('swiper');
        const SwiperCore = core.default || core;
        const Autoplay = (core as any).Autoplay || (await import('swiper/modules/autoplay/autoplay')).Autoplay;
        const FreeMode = (core as any).FreeMode || (await import('swiper/modules/free-mode/free-mode')).FreeMode;
        if (SwiperCore && Autoplay && FreeMode) {
          SwiperCore.use([Autoplay, FreeMode]);
        }
        if (mounted) {
          setLoadedSwiper({ Swiper, SwiperSlide });
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!LoadedSwiper) return null;
  const { Swiper, SwiperSlide } = LoadedSwiper;
  return (
    <Swiper
      spaceBetween={12}
      slidesPerView="auto"
      freeMode={true}
      loop={images.length > 1}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      speed={Math.max(2000, (duration || 5) * 1000)}
      className="w-full"
    >
      {images.map((item, idx) => {
        const src = typeof item === 'string' ? item : item.src;
        return (
          <SwiperSlide key={`${src}-${idx}`} style={{ width: 'auto' }} className="flex-shrink-0">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Image src={src} alt={`carousel-${idx}`} width={200} height={200} className="object-contain" />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
