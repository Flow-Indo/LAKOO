'use client';

import Image from 'next/image';

interface StoreBannerProps {
  coverImage: string;
  logoImage: string;
  name: string;
  tagline: string;
}

export default function StoreBanner({
  coverImage,
  logoImage,
  name,
  tagline
}: StoreBannerProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={coverImage || '/placeholder-banner.jpg'}
          alt={`${name} banner`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          onError={(e) => {
            // Fallback to gradient if image fails
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Logo & Info Overlay */}
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex items-end gap-4 -mt-12">
          {/* Logo */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden flex-shrink-0">
            <Image
              src={logoImage || '/placeholder-logo.png'}
              alt={`${name} logo`}
              fill
              className="object-cover"
              sizes="128px"
              onError={(e) => {
                // Fallback to first letter
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-white text-4xl font-bold">
                      ${name.charAt(0)}
                    </div>
                  `;
                }
              }}
            />
          </div>

          {/* Name & Tagline */}
          <div className="flex-1 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">
              {name}
            </h1>
            <p className="text-sm md:text-base text-white/90 drop-shadow">
              {tagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
