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
  const originalPricePerItem = product.originalPrice || displayPrice;
  const totalOriginalPrice = originalPricePerItem * quantity;

  return (
    <div className="pt-2">
      {/* Product Image, Price Info, and Quantity Selector */}
      <div className="py-2 flex items-start gap-4">
        {/* Small Square Product Image - Xiaohongshu Style */}
        <div className="relative w-26 h-26 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
          <Image
            src={selectedColorObj?.image || product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Price Info and Quantity Selector */}
        <div className="flex-1 min-w-0">
          {/* Price Info */}
          <div className="pb-1.5 flex items-baseline">
            <div className="flex items-baseline gap-0">
              <span className="text-[15px] font-bold text-[#FF2442]">Rp</span>
              <span className="text-[26px] font-bold text-[#FF2442] leading-none">
                {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            {totalOriginalPrice > totalPrice && (
              <span className="px-1 text-[15px] text-gray-400 line-through ml-3">
                {totalOriginalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {/* Hemat Badge */}
          {totalOriginalPrice > totalPrice && (
            <span className="inline-block px-2 py-0.5 bg-red-50 border border-red-200 rounded text-[11px] text-red-600 font-medium mt-1">
              Hemat {product.currency} {(totalOriginalPrice - totalPrice).toLocaleString('id-ID')}
            </span>
          )}

          {/* Quantity Selector - Below Hemat, No Label */}
          <div className="pt-4">
            <QuantitySelector
              value={quantity}
              onChange={onQuantityChange}
              min={1}
              max={99}
            />
          </div>
        </div>
      </div>

      {/* Selected Variant Info */}
      {(selectedColorObj || selectedSizeObj) && (
        <div className="pb-1 pt-1 text-[12px] text-gray-600">
          Yang dipilih: {selectedColorObj?.name || 'Warna'} / {selectedSizeObj?.name || 'Ukuran'}
          {selectedSizeObj?.weightRecommendation && ` • Saran: ${selectedSizeObj.weightRecommendation}`}
        </div>
      )}

      {/* Gray Border Line */}
      <div className="pt-2 border-t border-gray-100" />
    </div>
  );
}
