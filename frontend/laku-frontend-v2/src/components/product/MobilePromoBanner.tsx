'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

export default function MobilePromoBanner({ product }: any) {
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 59, seconds: 50 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-[#FF2442] via-[#FF6B7A] to-[#FF9CA8] px-3 sm:px-4 py-1 flex flex-col gap-0 leading-tight">
      <div className="flex items-center justify-between">
        <div style={{ fontFamily: 'cursive', fontSize: '20px' , fontWeight: 'bold'}} className="text-white">Super Deal</div>
        <div className="flex items-center gap-2">
          <div className="text-[12px] sm:text-[14px] font-normal text-white hidden sm:block">Diskon Instan Special Offer</div>
          <div className="text-[12px] sm:text-[14px] font-normal text-white"> 22/02/26 Berakhir</div>
        </div>
      </div>

      <div className="pb-1 flex items-center justify-between">
        <div className="text-[12px] sm:text-[14px]">
          <span className="font-bold text-[16px] sm:text-[18px] text-white">Rp </span>
          <span className="font-bold text-[24px] sm:text-[28px] text-white">{product.price?.toLocaleString('id-ID')}</span>
          <span className="font-bold line-through opacity-70 text-[16px] sm:text-[18px] text-white"> {product.originalPrice?.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[12px] sm:text-[14px] font-normal text-white">Terjual {product.sold}+</div>
        </div>
      </div>

      <div className="pb-1 flex items-center justify-between">
        <div className="bg-white text-[#CC1E3A] px-1.5 sm:px-2 py-1 rounded text-[12px] font-bold inline-flex">
          <span>Diskon {product.discountPercentage}% Hemat Rp {((product.originalPrice || 0) - (product.price || 0)).toLocaleString('id-ID')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white text-[#CC1E3A] px-1.5 sm:px-2 py-1 rounded text-[12px] font-bold">
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </div>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
      </div>
    </div>
  );
}
