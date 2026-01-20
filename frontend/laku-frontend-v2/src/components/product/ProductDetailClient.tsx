'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { ProductHeader } from './ProductHeader';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductPriceSection } from './ProductPriceSection';
import { ProductTitle } from './ProductTitle';
import { ProductVariantSelector } from './ProductVariantSelector';
import { ProductShippingInfo } from './ProductShippingInfo';
import { ProductPolicies } from './ProductPolicies';
import { ProductSellerCard } from './ProductSellerCard';
import { ProductSellerProducts } from './ProductSellerProducts';
import { ProductTabs } from './ProductTabs';
import { ProductBottomBar } from './ProductBottomBar';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import type { Product, ProductTab } from '@/types/product';

interface Props {
  product: Product;
}

export function ProductDetailClient({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'goods' | 'details' | 'recommend'>('goods');

  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  // Initialize with first available variants
  useEffect(() => {
    if (product.variants.sizes?.length && !selectedSize) {
      const firstAvailable = product.variants.sizes.find(s => s.available);
      if (firstAvailable) setSelectedSize(firstAvailable.id);
    }
    if (product.variants.colors?.length && !selectedColor) {
      const firstAvailable = product.variants.colors.find(c => c.available);
      if (firstAvailable) setSelectedColor(firstAvailable.id);
    }
  }, [product, selectedSize, selectedColor]);

  const tabs: ProductTab[] = [
    { id: 'goods', label: 'Goods' },
    { id: 'details', label: 'Details' },
    { id: 'recommend', label: 'Recommend', count: product.recommendations.length },
  ];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    try {
      // Convert new Product type to old Product type for cart compatibility
      const cartProduct = {
        id: product.id,
        name: product.name,
        slug: product.name.toLowerCase().replace(/\s+/g, '-'),
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.images[0],
        images: product.images,
        category: product.category,
        description: product.description,
        stock: product.stock,
        rating: product.rating,
        reviewCount: product.reviewCount,
        store: {
          id: product.seller.id,
          name: product.seller.name,
          logo: product.seller.logo,
          location: 'Indonesia',
          rating: product.seller.rating,
          verified: product.seller.isVerified,
        },
      };

      addItem(cartProduct, quantity);
      alert('Added to cart!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // In real app, navigate to checkout
    alert('Proceed to checkout...');
  };

  const handleToggleWishlist = () => {
    if (!user) {
      alert('Please login to add to wishlist');
      return;
    }
    setIsWishlisted(!isWishlisted);
  };

  const selectedSizeData = product.variants.sizes?.find(s => s.id === selectedSize);
  const selectedColorData = product.variants.colors?.find(c => c.id === selectedColor);

  const maxQuantity = selectedSizeData?.stock || product.stock;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <ProductHeader product={product} />

      {/* Main Content */}
      <main className="pb-32 md:pb-24">
        {/* Mobile Layout (< 768px) */}
        <div className="block md:hidden">
          <div className="space-y-0">
            {/* Image Gallery - Full Width */}
            <div className="mb-0">
              <ProductImageGallery images={product.images} />
            </div>

            {/* Product Info Sections - Stacked */}
            <div className="space-y-0">
              <ProductPriceSection
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                currency={product.currency}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />

              <ProductTitle
                name={product.name}
                shortDescription={product.shortDescription}
                tags={product.tags}
                seller={product.seller}
              />

              <ProductVariantSelector
                product={product}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                quantity={quantity}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
                onQuantityChange={setQuantity}
                onShowSizeGuide={() => setShowSizeGuide(true)}
              />

              <ProductShippingInfo shipping={product.shipping} />

              <ProductPolicies policies={product.policies} />

              <ProductSellerCard seller={product.seller} />

              <ProductSellerProducts recommendations={product.recommendations.slice(0, 4)} />
            </div>
          </div>

          {/* Tabs Section - Mobile Only */}
          <div className="mt-8 px-4">
            <ProductTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'goods' && (
                <div className="space-y-8 px-4">
                  {/* Customer Reviews */}
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-6">Customer Reviews</h3>

                      {/* Rating Summary */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">{product.rating}</div>
                          <div className="flex items-center justify-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= Math.floor(product.rating)
                                    ? 'bg-yellow-400'
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{product.reviewCount} reviews</div>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium mb-3 text-sm">Overall Fit:</h4>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Small</span>
                              <div className="flex-1 mx-4 h-1.5 bg-gray-200 rounded">
                                <div className="h-full bg-red-500 rounded" style={{ width: '3%' }} />
                              </div>
                              <span>3%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>True to Size</span>
                              <div className="flex-1 mx-4 h-1.5 bg-gray-200 rounded">
                                <div className="h-full bg-green-500 rounded" style={{ width: '87%' }} />
                              </div>
                              <span>87%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>Large</span>
                              <div className="flex-1 mx-4 h-1.5 bg-gray-200 rounded">
                                <div className="h-full bg-blue-500 rounded" style={{ width: '10%' }} />
                              </div>
                              <span>10%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Filter/Sort Bar */}
                      <div className="flex gap-2 mb-4 overflow-x-auto">
                        <button className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium whitespace-nowrap">
                          All Reviews ({product.reviewCount})
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 whitespace-nowrap">
                          Image (24)
                        </button>
                      </div>

                      {/* Tag Filters */}
                      <div className="flex gap-2 mb-6 overflow-x-auto">
                        {['No Smell (13)', 'Good Portability (6)', 'Keep Warm (4)', 'Comfortable (8)'].map((tag) => (
                          <button
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 whitespace-nowrap"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Cards */}
                    <div className="divide-y divide-gray-100">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={review.user.avatar}
                              alt={review.user.name}
                              className="w-8 h-8 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 text-sm">{review.user.name}</span>
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <div
                                      key={star}
                                      className={`w-3 h-3 ${
                                        star <= review.rating
                                          ? 'bg-yellow-400'
                                          : 'bg-gray-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">{review.createdAt.toLocaleDateString()}</span>
                              </div>

                              <p className="text-gray-700 text-sm leading-relaxed mb-2">{review.comment}</p>

                              {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mb-3 overflow-x-auto">
                                  {review.images.map((image, index) => (
                                    <img
                                      key={index}
                                      src={image}
                                      alt={`Review image ${index + 1}`}
                                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                                    />
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>Size: {review.variant}</span>
                                <button className="text-red-500 hover:underline">
                                  Helpful ({review.helpful})
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load More */}
                    <div className="p-4 border-t">
                      <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Load More Reviews
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="bg-white rounded-lg p-6 shadow-sm mx-4">
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Specifications</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Material:</dt>
                          <dd>{product.specifications.material}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Style:</dt>
                          <dd>{product.specifications.style}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Fit:</dt>
                          <dd>{product.specifications.fit}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Season:</dt>
                          <dd>{product.specifications.season}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Care Instructions</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {product.specifications.care.map((instruction, index) => (
                          <li key={index} className="text-gray-600">{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recommend' && (
                <div className="px-4 space-y-6">
                  {/* Category Filter Pills */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {['Recommend', 'Underwear & Sleepwear', 'Apparel Accessories'].map((category) => (
                      <button
                        key={category}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                          category === 'Recommend'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* "You May Also Like" Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">You May Also Like</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {product.recommendations.slice(0, 6).map((rec) => (
                        <div key={rec.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="relative">
                            <img
                              src={rec.image}
                              alt={rec.name}
                              className="w-full aspect-[3/4] object-cover"
                            />
                            {rec.discount && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                -{rec.discount}%
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="flex items-center gap-1 mb-1">
                              {rec.seller.isTrending && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Choice</span>
                              )}
                              <span className="text-xs text-gray-600">{rec.seller.name}</span>
                            </div>

                            <div className="flex items-center gap-1 mb-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <div
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= Math.floor(rec.rating)
                                        ? 'bg-yellow-400'
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">({rec.rating})</span>
                            </div>

                            <h4 className="font-medium text-sm line-clamp-2 mb-2">{rec.name}</h4>

                            <div className="flex items-center gap-2">
                              {rec.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  Rp{rec.originalPrice.toLocaleString()}
                                </span>
                              )}
                              <span className="text-sm font-bold text-red-600">
                                Rp{rec.price.toLocaleString()}
                              </span>
                            </div>

                            <div className="text-xs text-gray-600 mt-1">{rec.sold} sold</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View More Button */}
                  <div className="text-center">
                    <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      View More
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tablet/Desktop Layout (>= 768px) - SHEIN Inspired - TEMPORARILY DISABLED */}
        {/* Temporarily disabled to focus on mobile implementation */}
      </main>

      {/* Sticky Bottom Bar */}
      <ProductBottomBar
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        quantity={quantity}
        isWishlisted={isWishlisted}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Size Guide Modal (placeholder) */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Size Guide</h3>
            <p className="text-gray-600 mb-4">Size guide would be implemented here...</p>
            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full bg-gray-900 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}