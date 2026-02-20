import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  badges?: string[];
}

interface RecommendationsSectionProps {
  title?: string;
  products: Product[];
}

export function RecommendationsSection({
  title = 'You May Like',
  products,
}: RecommendationsSectionProps) {
  return (
    <div className="mt-12 border-t border-gray-200 pt-8 px-4 md:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-8 text-center">
        <button className="px-8 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
          View More Products
        </button>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group cursor-pointer">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badges?.includes('sale') && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-semibold">
              -{product.discount}%
            </span>
          )}
          {product.badges?.includes('hot') && (
            <span className="bg-black/90 text-white text-xs px-2 py-0.5 rounded font-semibold">
              HOT
            </span>
          )}
          {product.badges?.includes('new') && (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded font-semibold">
              NEW
            </span>
          )}
        </div>

        {/* Quick Add to Wishlist - Desktop Only */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
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
          </div>
          <span className="text-xs text-gray-600">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}