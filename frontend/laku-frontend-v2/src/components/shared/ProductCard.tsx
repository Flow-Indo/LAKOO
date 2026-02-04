import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import ProductName from './ProductName';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const rawImage = Array.isArray(product.images) ? product.images[0] : undefined;
  const imageSrc =
    typeof rawImage === 'string' ? rawImage : (rawImage as any)?.url || product.image || '/placeholder.jpg';
  const imageWidth = (rawImage as any)?.width;
  const imageHeight = (rawImage as any)?.height;

  // Use product.slug for dynamic href, fallback to id
  const productHref = product.slug ? `/product/${product.slug}` : `/product/prod-001`;

  return (
    <Link href={productHref} className="block w-full">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow w-full">
        {/* Image Container - enforce either square (1:1) or tall (1:1.5) aspect ratio */}
        {(() => {
          // Prefer explicit product.imageTall when provided (deterministic from mock-data).
          if ((product as any).imageTall === true) {
            const paddingBottom = `${1.5 * 100}%`;
            return (
              <div
                className="w-full bg-gray-100 overflow-hidden rounded-t-lg"
                style={{ position: 'relative', width: '100%', paddingBottom }}
              >
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            );
          }

          const actualRatio = imageWidth && imageHeight ? (imageHeight / imageWidth) : undefined;
          const targetRatio = actualRatio
            ? Math.abs(actualRatio - 1) <= Math.abs(actualRatio - 1.5)
              ? 1
              : 1.5
            : 1;

          // Use a positioned container with padding-bottom to enforce the aspect ratio.
          const paddingBottom = `${targetRatio * 100}%`;
          return (
            <div
              className="w-full bg-gray-100 overflow-hidden rounded-t-lg"
              style={{ position: 'relative', width: '100%', paddingBottom }}
            >
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          );
        })()}

        {/* Product Info - consistent spacing for all lines */}
        <div className="p-2" style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {/* Product Name - ALWAYS SAME CONTAINER */}
          <div style={{ margin: 0, padding: 0 }}>
            <ProductName name={product.name} badge={product.isOfficial ? 'LAKU' : undefined} />
          </div>

          {/* Rating and Sales */}
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center gap-1 text-yellow-400">
              <span className="text-xs">★</span>
              <span className="font-medium text-gray-700">{(product.rating ?? 0).toFixed(1)}</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">{product.sold ?? 0} terjual</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-red-600 font-bold">
              <span className="text-sm">Rp</span>
              <span className="text-lg">{product.price?.toLocaleString?.('id-ID') ?? ''}</span>
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-xs line-through">
                {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

