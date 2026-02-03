import MobileProductHeader from '@/components/product/MobileProductHeader';
import MobilePromoBanner from '@/components/product/MobilePromoBanner';
import MobileProductTabs from '@/components/product/MobileProductTabs';
import ProductDetails from '@/components/product/ProductDetails';
import ProductReviews from '@/components/product/ProductReviews';
import ProductQA from '@/components/product/ProductQA';
import { StoreSection } from '@/components/product/mobile/StoreSection';
import StickyBottomBar from '@/components/product/StickyBottomBar';
import { StoreRecommendations } from './mobile/StoreRecommendations';
import { SizeHelper } from './mobile/SizeHelper';
import { YouMayAlsoLike } from './mobile/YouMayAlsoLike';
import { DetailImages } from './mobile/DetailImages';
import ProductImageCarousel from '@/components/client/product/ProductImageCarousel';
import React from 'react';
// Helper function to parse sold value like "2.5K+" to number
function parseSoldValue(sold: string): number {
  if (!sold) return 0;
  const clean = sold.replace(/\+/g, '').toUpperCase();
  if (clean.includes('K')) {
    return Math.round(parseFloat(clean.replace('K','')) * 1000);
  }
  return parseInt(clean) || 0;
}



export default function MobileProductPageMain({ product }: any) {
  return (
    <div className="mobile-product-page bg-white min-h-screen">
      {/* Header Image */}
      <div className="relative w-full h-[60dvh] sm:h-[55dvh] md:h-[60dvh]">
        <ProductImageCarousel images={product.images} />
        <MobileProductHeader cartCount={6} />
      </div>

      {/* Content with padding for fixed bar */}
      <div className="pb-24">
        <MobilePromoBanner product={product} />
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <h1 className="text-[14px] sm:text-[14px] font-semibold leading-tight text-gray-900">
            {product.name}
          </h1>
        </div>
        <MobileProductTabs />
        <ProductDetails product={product} />
        <ProductReviews product={product} />
        <ProductQA product={product} />
        <div className="px-4 py-4">
          <StoreSection seller={product.seller} sold={product.seller.totalSold ?? 0} />
        </div>

        {/* NEW SECTIONS */}
        <StoreRecommendations
          storeId={product.seller?.id || 'store-001'}
          products={product.storeProducts || []}
        />

        <SizeHelper
          recommendedSize="S"
          sizeChart={product.sizeChart || []}
          buyerReferences={product.buyerReferences || []}
        />
        {/* Detail images section (full width) */}
        <div className="px-4 py-3">
          <h3 className="font-semibold text-gray-900 text-[16px]">Detail</h3>
        </div>
        <DetailImages
          images={[
            '/jeans/jean_mock_details/IMG_9982.JPG',
            '/jeans/jean_mock_details/IMG_9981.JPG',
            '/jeans/jean_mock_details/IMG_9980.JPG',
            '/jeans/jean_mock_details/IMG_9978.JPG',
            '/jeans/jean_mock_details/IMG_9977.JPG',
            '/jeans/jean_mock_details/IMG_9976.JPG',
            '/jeans/jean_mock_details/IMG_0010.JPG',
            '/jeans/jean_mock_details/IMG_0009.JPG',
            '/jeans/jean_mock_details/IMG_0008.JPG',
          ]}
        />

        <YouMayAlsoLike products={product.relatedProducts || []} />
        
        {/* Sticky bottom bar attached to end of content */}
        <StickyBottomBar
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            currency: product.currency,
            brand: product.brand,
            sellerId: product.seller?.id || 'store-001',
            sellerName: product.seller?.name || 'Toko Official',
            mainImage: product.mainImage,
            images: product.imageUrls,
            colorVariants: product.colors,
            sizeVariants: product.sizeVariants,
            shippingOptions: product.shippingOptions,
            vouchers: product.vouchers,
          }}
          wishlistCount={432}
        />
      </div>
    </div>
  );
}
