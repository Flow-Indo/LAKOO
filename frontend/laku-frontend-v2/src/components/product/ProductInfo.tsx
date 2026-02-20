import { Star, Heart, Store, MessageCircle, Shield, Truck } from 'lucide-react';
import Link from 'next/link';
import ColorSelector from '@/components/client/product/ColorSelector';
import SizeSelector from '@/components/client/product/SizeSelector';
import QuantitySelector from '@/components/client/product/QuantitySelector';
import AddToCartButton from '@/components/client/product/AddToCartButton';
import AnalyticsTracker from '@/components/client/product/AnalyticsTracker';
import AddToCartDesktop from '@/components/client/product/AddToCartDesktop';

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      action: string,
      parameters: Record<string, any>
    ) => void;
  }
}

interface Color {
  id: string;
  name: string;
  image: string;
  isHot?: boolean;
}

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    subtitle?: string;
    sku: string;
    rating: number;
    reviewCount: number;
    sold: number;
    stock: number;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    colors: Color[];
    sizes: string[];
    availableSizes: string[];
    badges?: string[];
    slug?: string; // Add slug for store link
    seller: {
      id: string;
      name: string;
      logo: string;
      verified: boolean;
      productCount: number;
      followers: number;
      rating: number;
    };
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  // Derive store slug from product slug or seller name
  const storeSlug = product.slug || product.seller.name?.toLowerCase().replace(/\s+/g, '-') || 'store-001';

  return (
    <div className="px-4 lg:px-0 py-4 space-y-6">
      {/* Analytics (client) */}
      <AnalyticsTracker product={product} />
      {/* Badges */}
      <div className="flex gap-2">
        {product.badges?.map((badge: string) => (
          <span key={badge} className="px-2 py-1 bg-red-500 text-white text-xs rounded">
            {badge}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{product.name}</h1>

      {/* Rating - Indonesian */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-1 font-semibold">{product.rating}</span>
        </div>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">{product.reviewCount} Penilaian</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">{product.sold}+ Terjual</span>
      </div>

      {/* Price - Indonesian Rupiah */}
      <div className="bg-red-50 rounded-lg p-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-red-600">
            Rp {product.price?.toLocaleString('id-ID')}
          </span>
          <span className="text-lg text-gray-400 line-through">
            Rp {product.originalPrice?.toLocaleString('id-ID')}
          </span>
          <span className="bg-red-500 text-white px-2 py-1 text-sm font-bold rounded">
            -{product.discountPercentage}%
          </span>
        </div>
      </div>

      {/* Color Selector - client */}
      <div>
        <ColorSelector colors={product.colors} />
      </div>

      {/* Size Selector - client */}
      <div>
        <SizeSelector sizes={product.sizes} availableSizes={product.availableSizes} />
      </div>

      {/* Quantity Selector - client */}
      <div>
        <label className="block text-sm font-medium mb-3">Jumlah</label>
        <QuantitySelector initial={1} max={product.stock} />
      </div>

      {/* Desktop Action Buttons - handled by client AddToCartButton */}
      <div className="hidden lg:block">
        {/* Client wrapper handles add-to-cart interaction */}
        <AddToCartDesktop productId={product.id} defaultQty={1} />
      </div>

      {/* Shipping Info - Indonesian */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-start gap-3 text-sm">
          <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">Pengiriman</p>
            <p className="text-gray-600">Gratis ongkir • Estimasi 2-4 hari</p>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">Pengembalian</p>
            <p className="text-gray-600">Gratis pengembalian dalam 7 hari</p>
          </div>
        </div>
      </div>

      {/* Seller Info - Indonesian */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <Link
                href={`/store/${storeSlug}`}
                className="font-semibold hover:text-[#ff2742] transition-colors"
              >
                {product.seller.name}
              </Link>
              <p className="text-sm text-gray-600">Online • Respon cepat</p>
            </div>
          </div>
          <Link href={`/store/${storeSlug}`}>
            <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
              Kunjungi Toko
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}