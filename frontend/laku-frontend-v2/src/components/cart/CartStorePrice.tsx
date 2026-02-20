'use client';

interface Props {
  price: number;
  originalPrice?: number;
}

export function CartStorePrice({ price, originalPrice }: Props) {
  return (
    <div className="flex items-center gap-2 text-left w-[200px]">
      <div className="text-sm font-medium text-red-600">Rp{price.toLocaleString()}</div>
      {originalPrice && originalPrice > price && (
        <div className="text-xs text-gray-500 line-through">{originalPrice.toLocaleString()}</div>
      )}
    </div>
  );
}

