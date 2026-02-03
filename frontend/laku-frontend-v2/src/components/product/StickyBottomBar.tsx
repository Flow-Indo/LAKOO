'use client';

import { useState, useRef, useEffect } from 'react';
import { Store, Star, MessageCircle, ShoppingCart } from 'lucide-react';
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
  const [isFavorited, setIsFavorited] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
  };

  const brandSlug = product.brand?.toLowerCase().replace(/\s+/g, '-') || 'default';

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
      { id: 's', name: 'S', price: product.price, stock: 10 },
      { id: 'm', name: 'M', price: product.price, stock: 10 },
      { id: 'l', name: 'L', price: product.price, stock: 10 }
    ],
    shippingOptions: product.shippingOptions || [],
    vouchers: product.vouchers || []
  };

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe"
      >
        <div className="flex items-center justify-between px-2 py-3">
          {/* Left buttons - Store, Favorite, Chat */}
          <div className="flex items-center gap-0">
            <Link 
              href={`http://localhost:3001/store/store-${brandSlug}`}
              className="flex flex-col items-center justify-center w-12 h-12 group"
            >
              <Store className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
            </Link>
            
            <button
              onClick={handleFavoriteToggle}
              className="flex flex-col items-center justify-center w-12 h-12 group"
            >
              <Star 
                className={`w-5 h-5 transition-all ${
                  isFavorited ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700 group-hover:text-gray-900'
                }`}
              />
            </button>
            
            <Link 
              href="http://localhost:3001/messages"
              className="flex flex-col items-center justify-center w-12 h-12 group"
            >
              <MessageCircle className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
            </Link>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowCheckoutModal(true)}
              className="h-12 w-28 bg-[#FFF0F3] text-[#FF2442] rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              Keranjang
            </button>
            
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="h-12 w-28 bg-[#FF2442] text-white rounded-lg text-sm font-semibold"
            >
              Beli Sekarang
            </button>
          </div>
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
