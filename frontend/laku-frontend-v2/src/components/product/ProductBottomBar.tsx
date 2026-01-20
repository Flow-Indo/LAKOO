'use client';

import { Heart, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist: () => void;
}

export function ProductBottomBar({
  product,
  selectedSize,
  selectedColor,
  quantity,
  isWishlisted,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
}: Props) {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleStoreClick = () => {
    router.push(`/seller/${product.seller.id}`);
  };

  const discountText = product.discount ? `${product.discount}% OFF! ` : '';

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 mx-4 mb-2 rounded-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between h-12">
          {/* Store Button - 20% */}
          <button
            onClick={handleStoreClick}
            className="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors flex-1"
          >
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-3 h-3 text-gray-600" />
            </div>
            <span className="text-xs text-gray-600">Store</span>
          </button>

          {/* Wishlist Button - 20% */}
          <button
            onClick={onToggleWishlist}
            className="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors flex-1"
          >
            <Heart
              className={`w-6 h-6 ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
            <span className="text-xs text-gray-600">{isWishlisted ? 'Saved' : 'Save'}</span>
          </button>

          {/* Add to Cart Button - 60% */}
          <button
            onClick={onAddToCart}
            className="flex flex-col items-center gap-1 p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex-[3] text-white"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-medium">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}