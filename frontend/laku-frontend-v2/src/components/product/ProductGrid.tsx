import React from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  image?: string;
  price?: number;
  originalPrice?: number;
}

interface Props {
  products: Product[];
}

// Server component: simple product grid rendering (no interactivity)
export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <div key={p.id} className="bg-white border rounded-lg p-3">
          <div className="aspect-square relative rounded overflow-hidden bg-gray-100 mb-2">
            {p.image ? (
              // next/image okay in server components for static images
              <Image src={p.image} alt={p.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
          {typeof p.price === 'number' && (
            <div className="text-sm text-red-600 font-semibold mt-1">Rp {p.price.toLocaleString('id-ID')}</div>
          )}
        </div>
      ))}
    </div>
  );
}

