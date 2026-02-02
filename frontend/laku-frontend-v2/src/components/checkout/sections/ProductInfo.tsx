'use client';

import Image from 'next/image';
import { CheckoutProduct } from '@/types/checkout';
import QuantitySelector from '../ui/QuantitySelector';

interface ProductInfoProps {
  product: CheckoutProduct;
  selectedColor: string | null;
  selectedSize: string | null;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export default function ProductInfo({
  product,
  selectedColor,
  selectedSize,
  quantity,
  onQuantityChange,
}: ProductInfoProps) {
  const selectedSizeObj = product.sizes.find(s => s.id === selectedSize);
  const selectedColorObj = product.colors.find(c => c.id === selectedColor);
  const displayPrice = selectedSizeObj?.price || product.price;
  const totalPrice = displayPrice * quantity;
  const originalDisplayPrice = product.originalPrice || displayPrice;

  return (
    <div className="py-4 space-y-4">
      {/* Product Image and Price */}
      <div className="flex items-start gap-4">
        {/* Small Square Product Image - Xiaohongshu Style */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
          <Image
            src={selectedColorObj?.image || product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Price Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[11px] text-gray-500">Harga Akhir</span>
            <span className="text-[22px] font-bold text-[#FF2442]">
              {product.currency} {Math.floor(totalPrice / 1000).toLocaleString('id-ID')}
            </span>
          </div>

          {originalDisplayPrice > totalPrice && (
            <div className="text-[12px] text-gray-400 mb-1">
              Sebelumnya: <span className="line-through">{product.currency} {Math.floor(originalDisplayPrice / 1000).toLocaleString('id-ID')}</span>
            </div>
          )}

          {totalPrice < originalDisplayPrice && (
            <span className="px-2 py-0.5 bg-red-50 border border-red-200 rounded text-[11px] text-red-600 font-medium">
              Hemat {product.currency} {(originalDisplayPrice - totalPrice).toLocaleString('id-ID')}
            </span>
          )}
        </div>
      </div>

      {/* Selected Variant Info */}
      {(selectedColorObj || selectedSizeObj) && (
        <div className="text-[12px] text-gray-600">
          Yang dipilih: {selectedColorObj?.name || 'Warna'} / {selectedSizeObj?.name || 'Ukuran'}
          {selectedSizeObj?.weightRecommendation && ` • Saran: ${selectedSizeObj.weightRecommendation}`}
        </div>
      )}

      {/* Quantity Selector - Moved Here */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-[14px] font-medium text-gray-900">Jumlah</span>
        <QuantitySelector
          value={quantity}
          onChange={onQuantityChange}
          min={1}
          max={99}
        />
      </div>
    </div>
  );
}
