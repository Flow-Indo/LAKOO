 'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface DetailImagesProps {
  images: string[]; // paths relative to /public
}

const BLUR_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

export function DetailImages({ images }: DetailImagesProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, next, prev]);

  return (
    <div className="px-0 py-4 border-t border-gray-200">
      <div className="space-y-3">
        {images.map((src, idx) => (
          <div key={idx} className="w-full bg-gray-100 block overflow-hidden">
            <button
              onClick={() => openAt(idx)}
              className="w-full block focus:outline-none"
              aria-label={`Buka gambar detail ${idx + 1}`}
            >
              <Image
                src={src}
                alt={`Detail ${idx + 1}`}
                width={1200}
                height={900}
                sizes="100vw"
                className="object-cover w-full h-auto"
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </button>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2"
            aria-label="Tutup"
          >
            ✕
          </button>

          <button
            onClick={prev}
            className="absolute left-4 text-white bg-black/40 rounded-full p-2"
            aria-label="Sebelumnya"
          >
            ‹
          </button>

          <div className="max-w-[96vw] max-h-[92vh] w-full">
            <Image
              src={images[index]}
              alt={`Detail besar ${index + 1}`}
              width={1600}
              height={1200}
              sizes="(max-width: 768px) 96vw, 80vw"
              className="object-contain w-full h-auto"
              priority
            />
          </div>

          <button
            onClick={next}
            className="absolute right-4 text-white bg-black/40 rounded-full p-2"
            aria-label="Berikutnya"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

