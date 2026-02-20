import Image from 'next/image';
import Link from 'next/link';

interface YouMayAlsoLikeProps {
  products: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    preorders: number;
  }>;
}

export function YouMayAlsoLike({ products }: YouMayAlsoLikeProps) {
  return (
    <div className="px-4 py-4 border-t border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4 text-base">Lihat Juga</h3>

      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="block">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div className="p-2">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-tight break-words">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-red-600 font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
                </div>
                <p className="text-xs text-gray-500">{product.preorders}+ orang memesan</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

