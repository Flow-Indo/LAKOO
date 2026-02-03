'use client';

import { useState } from 'react';
import { ChevronLeft, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import { ProductTabs } from '@/components/product/ProductTabs';
import { ReviewsSection } from '@/components/product/ReviewsSection';
import { RecommendationsSection } from '@/components/product/RecommendationsSection';
import StickyBottomBar from '@/components/product/StickyBottomBar';

export default function ProductPageClient({ product }: { product: any }) {
  const router = useRouter();

  return (
    <>
      {/* Mobile Back Button - Fixed */}
      <button
        onClick={() => router.back()}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Main Content - SCROLLABLE */}
      <div className="w-full min-h-screen bg-white pb-20 lg:pb-0">
        {/* Breadcrumbs - Desktop Only */}
        <nav className="hidden lg:block bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-gray-600 hover:text-red-500 transition-colors">Beranda</a>
            <span className="text-gray-400">/</span>
            <a href={`/category/${product.categorySlug}`} className="text-gray-600 hover:text-red-500 transition-colors">
              {product.category}
            </a>
            <span className="text-gray-400">/</span>
            <a href={`/category/${product.categorySlug}/${product.subcategorySlug}`} className="text-gray-600 hover:text-red-500 transition-colors">
              {product.subcategory}
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </nav>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* 1. Image Carousel - Fixed at top */}
          <div className="relative h-[60dvh] sm:h-[55dvh] md:h-[60dvh] sticky top-0 z-10">
              <ProductImageGallery images={product.images} />
            </div>

          {/* 2. Red Banner - Sticky below carousel */}
          <div className="sticky top-[60dvh] sm:top-[55dvh] md:top-[60dvh] z-20 bg-red-500 flex items-center px-4">
            <div className="flex items-center justify-between w-full text-white text-sm">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-lg font-bold">Rp {product.salePrice.toLocaleString('id-ID')}</span>
                  <span className="ml-2 text-sm line-through opacity-80">Rp {product.originalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="bg-red-600 px-2 py-1 rounded text-xs font-bold">
                  -{product.discountPercentage}%
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">{product.sold}+ Terjual</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm">{product.rating}</span>
                </div>
                <span className="text-sm">{product.reviewCount} penilaian</span>
              </div>
            </div>
          </div>

          {/* 4. Product Name - Sticky below banner */}
          <div className="sticky top-[69dvh] sm:top-[64dvh] md:top-[69dvh] z-10 bg-white px-4 py-4">
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
          </div>

          {/* 5. Rest of content - Scrolls naturally */}
          <div className="px-4 pb-24">
              <ProductTabs product={product} />
              <ReviewsSection
                productId={product.id}
                averageRating={product.rating}
                totalReviews={product.reviewCount}
                reviews={product.reviews}
              />
              <RecommendationsSection products={product.recommendations} />
            </div>
          </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block px-6 py-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7">
              <ProductImageGallery images={product.images} />
            </div>
            <div className="col-span-5">
              <ProductInfo product={product} />
            </div>
          </div>
          <div className="mt-8">
            <ProductTabs product={product} />
            <ReviewsSection
              productId={product.id}
              averageRating={product.rating}
              totalReviews={product.reviewCount}
              reviews={product.reviews}
            />
            <RecommendationsSection products={product.recommendations} />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <StickyBottomBar product={product} />
    </>
  );
}