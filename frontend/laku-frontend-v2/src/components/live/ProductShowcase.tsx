'use client';

import Image from 'next/image';
import { ShoppingCart, Eye, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import type { LiveShopProduct } from '@/types/live-shopping';

interface Props {
  product: LiveShopProduct;
  shopId: string;
}

export function ProductShowcase({ product, shopId }: Props) {
  const router = useRouter();
  const addToCart = useCartStore(state => state.addItem);

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.id, // Use id as slug for now
      price: product.price,
      originalPrice: product.originalPrice,
      discount: discountPercentage,
      image: product.image,
      category: 'shopping',
      description: product.description,
      stock: product.stock,
      rating: product.rating,
      reviewCount: Math.floor(product.sold * 0.1), // Estimate review count
      sold: product.sold,
      store: {
        id: shopId,
        name: 'Shop', // We'll get this from shop context
        location: 'Indonesia',
      },
    });
    // Show toast notification
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/95 to-transparent pt-8">

      <div className="px-4 pb-safe">

        {/* Product Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/20">

          <div className="flex gap-4">

            {/* Product Image */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
              {discountPercentage > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                {product.name}
              </h4>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xl font-bold text-red-600">
                  Rp{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    Rp{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{product.sold.toLocaleString()} sold</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                    {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.push(`/products/${product.id}`)}
              className="flex-1 px-4 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}