'use client';

import React, { useEffect, useState } from 'react';

interface ProfileBackgroundProps {
  children: React.ReactNode;
}

export default function ProfileBackground({ children }: ProfileBackgroundProps) {
  const [bgStyle, setBgStyle] = useState<React.CSSProperties | undefined>(undefined);

  useEffect(() => {
    const imageUrl = '/batikbg2.png';
    const encodedImageUrl = encodeURI(imageUrl);

    const computeAverageColor = (url: string) =>
      new Promise<string>((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = url;

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const w = 50;
            const h = 50;
            canvas.width = w;
            canvas.height = h;

            if (!ctx) return resolve('rgba(0,0,0,0.6)');

            ctx.drawImage(img, 0, 0, w, h);
            const data = ctx.getImageData(0, 0, w, h).data;

            let r = 0;
            let g = 0;
            let b = 0;
            let count = 0;

            for (let i = 0; i < data.length; i += 16) {
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              count++;
            }

            if (count === 0) return resolve('rgba(0,0,0,0.6)');

            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);

            resolve(`rgb(${r}, ${g}, ${b})`);
          } catch {
            resolve('rgba(0,0,0,0.6)');
          }
        };

        img.onerror = () => resolve('rgba(0,0,0,0.6)');
      });

    // show image instantly
    setBgStyle({
      backgroundImage: `url("${encodedImageUrl}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'rgba(0,0,0,0.12)',
    });

    let cancelled = false;
    (async () => {
      const dominant = await computeAverageColor(imageUrl);
      if (cancelled) return;
      setBgStyle({
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${dominant} 100%), url("${encodedImageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: dominant,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0" style={bgStyle} />
      <div className="absolute inset-0 bg-gray-900/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gray-900/30 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

