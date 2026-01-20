'use client';

import { Minus, Plus, Ruler } from 'lucide-react';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onSizeChange: (sizeId: string) => void;
  onColorChange: (colorId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onShowSizeGuide: () => void;
}

export function ProductVariantSelector({
  product,
  selectedSize,
  selectedColor,
  quantity,
  onSizeChange,
  onColorChange,
  onQuantityChange,
  onShowSizeGuide,
}: Props) {
  const selectedSizeData = product.variants.sizes?.find(s => s.id === selectedSize);
  const maxQuantity = Math.min(
    selectedSizeData?.stock || product.stock,
    product.maxOrder
  );

  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > product.minOrder) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
      {/* Size Selector */}
      {product.variants.sizes && product.variants.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Size</h3>
            <button
              onClick={onShowSizeGuide}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              <Ruler className="w-4 h-4" />
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.variants.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => size.available && onSizeChange(size.id)}
                disabled={!size.available}
                className={`py-3 px-4 border rounded-lg text-sm font-medium transition-colors ${
                  selectedSize === size.id
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : size.available
                    ? 'border-gray-200 hover:border-gray-300 text-gray-900'
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Not your size? Tell me your size
          </p>
        </div>
      )}

      {/* Color Selector */}
      {product.variants.colors && product.variants.colors.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
          <div className="flex flex-wrap gap-3">
            {product.variants.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => color.available && onColorChange(color.id)}
                disabled={!color.available}
                className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                  selectedColor === color.id
                    ? 'border-red-500 scale-110'
                    : color.available
                    ? 'border-gray-300 hover:border-gray-400'
                    : 'border-gray-200 opacity-50 cursor-not-allowed'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {!color.available && (
                  <div className="absolute inset-0 bg-gray-400 bg-opacity-50 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= product.minOrder}
              className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-3 font-medium min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              disabled={quantity >= maxQuantity}
              className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {selectedSizeData?.stock || product.stock} available
          </span>
        </div>
      </div>

      {/* Stock Warning */}
      {selectedSizeData && selectedSizeData.stock < 10 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            Only {selectedSizeData.stock} left in stock - order soon!
          </p>
        </div>
      )}
    </div>
  );
}