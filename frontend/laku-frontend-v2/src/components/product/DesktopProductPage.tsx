import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import { ProductTabs } from '@/components/product/ProductTabs';
import { ReviewsSection } from '@/components/product/ReviewsSection';
import { RecommendationsSection } from '@/components/product/RecommendationsSection';
// This is a Server Component - keep interactivity in small client components
// No 'use client' directive here.
import type { Metadata } from 'next';

interface DesktopProductPageProps {
  product: any; // Use any to avoid complex interface duplication
}

export default function DesktopProductPage({ product }: DesktopProductPageProps) {
  return (
    <div className="w-full">
      {/* Breadcrumbs - Desktop Only */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
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

      {/* Product Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Image Gallery */}
          <div className="col-span-7">
            <ProductImageGallery images={product.images} />
          </div>

          {/* Right: Product Info */}
          <div className="col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Full Width Sections */}
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
  );
}