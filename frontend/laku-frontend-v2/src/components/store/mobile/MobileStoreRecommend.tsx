import Link from 'next/link';
import Image from 'next/image';
import { Store } from '@/types/store';
import { formatPrice } from '@/lib/formatters';

interface MobileStoreRecommendProps {
  store: Store;
}

export function MobileStoreRecommend({ store }: MobileStoreRecommendProps) {
  return (
    <div className="bg-white">
      <div className="p-4 space-y-6">
        {/* Best Sellers */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Best Sellers</h3>
          <div className="grid grid-cols-2 gap-3">
            {store.products
              .filter(p => p.isBestSeller)
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>

        {/* New Arrivals */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">New Arrivals</h3>
          <div className="grid grid-cols-2 gap-3">
            {store.products
              .filter(p => p.isNew)
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>

        {/* Similar Stores */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Similar Stores</h3>
          <div className="space-y-3">
            {/* Mock similar stores */}
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=60&h=60&fit=crop&crop=center"
                alt="Similar store"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">FashionHub</h4>
                <p className="text-sm text-gray-600">Premium fashion & accessories</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-gray-600">4.5 ★</span>
                  <span className="text-sm text-gray-600">• 50K followers</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              -{product.discount}%
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}