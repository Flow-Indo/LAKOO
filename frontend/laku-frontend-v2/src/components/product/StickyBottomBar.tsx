'use client';

import { useState } from 'react';
import { Store, MessageCircle, Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { CheckoutModal } from '@/components/checkout';
import type { CheckoutProduct, ColorVariant, SizeVariant } from '@/types/checkout';

interface StickyBottomBarProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    currency: string;
    brand?: string;
    sellerId?: string;
    sellerName?: string;
    mainImage?: string;
    images?: string[];
    colorVariants?: ColorVariant[];
    sizeVariants?: SizeVariant[];
    shippingOptions?: any[];
    vouchers?: any[];
  };
  wishlistCount?: number;
}

// Map product IDs to their actual color variants with real product images
const getColorVariants = (productId: string, mainImage?: string): ColorVariant[] => {
  const colorMappings: Record<string, ColorVariant[]> = {
    'cult-suri': [
      {
        id: 'coco-beige',
        name: 'Beige',
        label: 'Beige',
        image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_produk.webp',
        stock: 15
      }
    ],
    'karakiri': [
      {
        id: 'jolie-black',
        name: 'Black',
        label: 'Black',
        image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk.webp',
        stock: 20
      },
      {
        id: 'jolie-cream',
        name: 'Cream',
        label: 'Cream',
        image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk2.webp',
        stock: 15
      },
      {
        id: 'jolie-brown',
        name: 'Brown',
        label: 'Brown',
        image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk3.webp',
        stock: 18
      },
      {
        id: 'jolie-olive',
        name: 'Olive',
        label: 'Olive',
        image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk4.webp',
        stock: 12
      }
    ],
    'rue': [
      {
        id: 'sheer-black',
        name: 'Black',
        label: 'Black',
        image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk.webp',
        stock: 25
      },
      {
        id: 'sheer-white',
        name: 'White',
        label: 'White',
        image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk2.webp',
        stock: 22
      },
      {
        id: 'sheer-grey',
        name: 'Grey',
        label: 'Grey',
        image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk3.webp',
        stock: 18
      },
      {
        id: 'sheer-beige',
        name: 'Beige',
        label: 'Beige',
        image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk4.webp',
        stock: 20
      }
    ],
    'wearthreek': [
      {
        id: 'britney-light-blue',
        name: 'Light Blue',
        label: 'Light Blue',
        image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk.webp',
        stock: 30
      },
      {
        id: 'britney-dark-blue',
        name: 'Dark Blue',
        label: 'Dark Blue',
        image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk2.webp',
        stock: 28
      },
      {
        id: 'britney-black',
        name: 'Black',
        label: 'Black',
        image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk3.webp',
        stock: 25
      },
      {
        id: 'britney-grey',
        name: 'Grey',
        label: 'Grey',
        image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk4.webp',
        stock: 22
      }
    ]
  };

  return colorMappings[productId] || [
    {
      id: 'default',
      name: 'Default',
      label: 'Default',
      image: mainImage || '/placeholder-product.webp',
      stock: 10
    }
  ];
};

export default function StickyBottomBar({ product, wishlistCount = 432 }: StickyBottomBarProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    // Add wishlist logic here
  };

  // Safely get brand slug for store link
  const brandSlug = product.brand?.toLowerCase().replace(/\s+/g, '-') || 'default';

  // Prepare checkout product data with REAL IMAGES from color variants
  const checkoutProduct: CheckoutProduct = {
    id: product.id,
    name: product.name,
    brand: product.brand || 'Unknown',
    price: product.price,
    originalPrice: product.originalPrice,
    currency: product.currency || 'Rp',
    image: product.mainImage || '/placeholder-product.webp',
    images: product.images,
    colors: getColorVariants(product.id.replace('prod-', ''), product.mainImage),
    sizes: product.sizeVariants && product.sizeVariants.length > 0 ? product.sizeVariants : [
      {
        id: 's',
        name: 'S',
        price: product.price,
        stock: 10
      },
      {
        id: 'm',
        name: 'M',
        price: product.price,
        stock: 10
      },
      {
        id: 'l',
        name: 'L',
        price: product.price,
        stock: 10
      }
    ],
    shippingOptions: product.shippingOptions || [],
    vouchers: product.vouchers || []
  };

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Store Icon Button */}
          <Link href={`http://localhost:3001/store/store-${brandSlug}`} className="flex flex-col items-center justify-center min-w-[48px]">
            <Store className="w-5 h-5 text-gray-700" />
            <span className="text-[10px] text-gray-600 mt-0.5">Toko</span>
          </Link>

          {/* Customer Support Icon Button */}
          <Link href="http://localhost:3001/messages" className="flex flex-col items-center justify-center min-w-[48px]">
            <MessageCircle className="w-5 h-5 text-gray-700" />
            <span className="text-[10px] text-gray-600 mt-0.5">Bantuan</span>
          </Link>

          {/* Like Button - Star with border */}
          <button
            onClick={handleLikeToggle}
            className="flex flex-col items-center justify-center min-w-[48px]"
          >
            <Star className={`w-5 h-5 ${isLiked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
            <span className="text-[10px] text-gray-600 mt-0.5">{wishlistCount}</span>
          </button>

          {/* Add to Cart Button */}
          <button className="flex-1 h-11 bg-[#FF9BB0] text-white rounded-lg text-[15px] font-semibold hover:bg-[#FF8AA5] transition-colors flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Keranjang
          </button>

          {/* Buy Now Button - Opens Checkout Modal */}
          <button
            onClick={() => setShowCheckoutModal(true)}
            className="flex-1 h-11 bg-[#FF2442] text-white rounded-lg text-[15px] font-semibold hover:bg-[#E61E3A] transition-colors ml-2"
          >
            Beli Sekarang
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        product={checkoutProduct}
      />
    </>
  );
}
