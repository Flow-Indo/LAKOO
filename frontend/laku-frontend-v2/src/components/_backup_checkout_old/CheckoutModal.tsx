'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronRight, ChevronDown, Shield } from 'lucide-react';
import type { ProductVariant, ProductSize, ShippingOption, StoreVoucher } from '@/lib/products-data';

// Re-export types for backward compatibility
export type { ProductVariant, ProductSize, ShippingOption, StoreVoucher };

export interface CheckoutProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  images?: string[];
  colors: ProductVariant[];
  sizes: ProductSize[];
  shippingOptions?: ShippingOption[];
  vouchers?: StoreVoucher[];
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CheckoutProduct;
}

export default function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  // State management
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.id || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedShipping, setSelectedShipping] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [colorViewMode, setColorViewMode] = useState<'grid' | 'list'>('grid');
  const [showShippingDropdown, setShowShippingDropdown] = useState(false);
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showDetailDropdown, setShowDetailDropdown] = useState(false);
  const [note, setNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Countdown timer for voucher
  const [timeLeft, setTimeLeft] = useState(23 * 3600 + 24 * 60 + 44);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Get selected data
  const selectedColorData = product.colors.find(c => c.id === selectedColor);
  const selectedSizeData = product.sizes.find(s => s.id === selectedSize);
  const selectedShippingData = product.shippingOptions?.find(s => s.id === selectedShipping);
  const selectedVoucherData = product.vouchers?.find(v => v.id === selectedVoucher);

  const safePrice = product.price || 0;
  const safeCurrency = product.currency || 'Rp';

  // Price calculations
  const basePrice = ((selectedSizeData?.price ?? safePrice) * quantity);
  const originalPrice = product.originalPrice ? product.originalPrice * quantity : basePrice;
  const voucherDiscount = selectedVoucherData
    ? selectedVoucherData.discountType === 'percentage'
      ? Math.min((basePrice * selectedVoucherData.discount) / 100, selectedVoucherData.maxDiscount || Infinity)
      : selectedVoucherData.discount
    : 0;
  const shippingCost = selectedShippingData?.price || 0;
  const finalPrice = basePrice - voucherDiscount + shippingCost;

  // Payment options
  const paymentMethods = [
    { id: 'dana', name: 'DANA', icon: '💳' },
    { id: 'gopay', name: 'GoPay', icon: '💳' },
    { id: 'ovo', name: 'OVO', icon: '💳' },
    { id: 'shopeepay', name: 'ShopeePay', icon: '💳' },
    { id: 'bca', name: 'BCA Virtual Account', icon: '🏦' },
    { id: 'mandiri', name: 'Mandiri Virtual Account', icon: '🏦' },
    { id: 'bni', name: 'BNI Virtual Account', icon: '🏦' },
    { id: 'bri', name: 'BRI Virtual Account', icon: '🏦' },
    { id: 'alfamart', name: 'Alfamart', icon: '🏪' },
    { id: 'indomaret', name: 'Indomaret', icon: '🏪' },
  ];

  const handleCheckout = () => {
    if (!selectedSize) {
      alert('Silakan pilih ukuran');
      return;
    }
    if (!selectedShipping) {
      alert('Silakan pilih opsi pengiriman');
      return;
    }
    if (!selectedPayment) {
      alert('Silakan pilih metode pembayaran');
      return;
    }
    console.log({ 
      product: product.id, 
      color: selectedColor, 
      size: selectedSize, 
      shipping: selectedShipping,
      payment: selectedPayment,
      total: finalPrice 
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal Container */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        
        {/* SECTION 1: CHECKOUT TITLE */}
        <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] text-emerald-700 font-medium">
                Garansi Platform | 7 Hari Pengembalian Gratis
              </span>
            </div>
            <button onClick={onClose} className="p-1">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* SECTION 2: PRODUCT IMAGE + PRICE */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex gap-3 mb-3">
            <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <Image
                src={selectedColorData?.image || product.image || '/placeholder-product.webp'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[11px] text-gray-500">Harga Akhir</span>
                <span className="text-[22px] font-bold text-[#FF2442]">
                  {safeCurrency} {Math.floor(finalPrice / 1000).toLocaleString('id-ID')}
                </span>
              </div>

              {originalPrice > basePrice && (
                <div className="text-[12px] text-gray-400 mb-2">
                  Sebelumnya: <span className="line-through">{safeCurrency} {Math.floor(originalPrice / 1000).toLocaleString('id-ID')}</span>
                </div>
              )}

              {voucherDiscount > 0 && (
                <button className="px-2 py-0.5 bg-red-50 border border-red-200 rounded text-[11px] text-red-600 font-medium inline-flex items-center gap-1">
                  {safeCurrency} {voucherDiscount.toLocaleString('id-ID')} off platform coupon
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {selectedColorData && selectedSizeData && (
            <div className="text-[12px] text-gray-600">
              Yang dipilih: {selectedColorData.name} / {selectedSizeData.name} saran {selectedSizeData.weightRecommendation}
            </div>
          )}
        </div>

        {/* SECTION 3: COLOR OPTIONS */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-gray-900">
              {product.colors && product.colors.length > 1 
                ? `Warna (${product.colors.length})` 
                : 'Foto (1)'}
            </h3>
            <button 
              onClick={() => setColorViewMode(colorViewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center gap-1 text-[13px] text-gray-600"
            >
              <span>☰ List View</span>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {product.colors && product.colors.length > 0 ? (
              product.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  disabled={color.stock === 0}
                  className={`relative border-2 rounded-lg overflow-hidden transition-all ${
                    selectedColor === color.id
                      ? 'border-[#FF2442]'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="relative aspect-[3/4] bg-gray-100">
                    <Image
                      src={color.image}
                      alt={color.name}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                    
                    <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-black/50 rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                    
                    {color.stock === 0 && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="text-[12px] text-gray-500 font-medium">Habis</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-1 py-1.5 bg-white text-center">
                    <p className="text-[12px] text-gray-900 truncate font-medium">
                      {color.name}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center py-4 text-gray-500">
                No colors available
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: SIZE OPTIONS */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-gray-900">Ukuran</h3>
              <span className="text-[13px] text-gray-500">
                Rekomendasi: <span className="text-[#FF2442] font-medium">M</span>
              </span>
            </div>
            <button className="flex items-center gap-1 text-[13px] text-gray-600">
              <span>Tambah ukuran</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={`px-3 py-3 border rounded-lg transition-all ${
                  selectedSize === size.id
                    ? 'border-[#FF2442] text-[#FF2442] bg-[#FFF0F3]'
                    : 'border-gray-200 text-gray-900'
                }`}
              >
                <div className="text-center">
                  <div className="text-[16px] font-bold mb-1">
                    {size.name}
                  </div>
                  {size.weightRecommendation && (
                    <div className="text-[11px] text-gray-500">
                      Saran: {size.weightRecommendation}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 5: CATATAN UNTUK PENJUAL */}
        <div className="px-4 py-3 border-b border-gray-100">
          {isEditingNote ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Contoh: Size M, warna navy..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:border-[#FF2442]"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingNote(false)}
                  className="px-4 py-1.5 text-[13px] text-gray-600 bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={() => setIsEditingNote(false)}
                  className="px-4 py-1.5 text-[13px] text-white bg-[#FF2442] rounded-lg"
                >
                  Simpan
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingNote(true)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex-1">
                <h3 className="text-[15px] font-medium text-gray-900 mb-0.5">
                  Catatan untuk Penjual
                </h3>
                <p className="text-[11px] text-gray-400">
                  Opsional
                </p>
                {note && (
                  <p className="text-[12px] text-gray-600 mt-1">
                    {note}
                  </p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
            </button>
          )}
        </div>

        {/* SECTION 6: OPSI PENGIRIMAN (DROPDOWN) */}
        <div className="px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => setShowShippingDropdown(!showShippingDropdown)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium text-gray-900">Opsi Pengiriman</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showShippingDropdown ? 'rotate-180' : ''}`} />
          </button>

          {!showShippingDropdown && selectedShippingData && (
            <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg text-[14px]">
              <span className="font-medium">{selectedShippingData.courier} {selectedShippingData.service}</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className={selectedShippingData.isFree ? 'text-green-600' : ''}>
                {selectedShippingData.isFree ? 'Gratis' : `${safeCurrency} ${selectedShippingData.price.toLocaleString('id-ID')}`}
              </span>
            </div>
          )}

          {showShippingDropdown && (
            <div className="mt-3 space-y-2">
              {product.shippingOptions?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedShipping(option.id);
                    setShowShippingDropdown(false);
                  }}
                  className={`w-full p-3 border rounded-lg text-left transition-all ${
                    selectedShipping === option.id
                      ? 'border-[#FF2442] bg-[#FFF0F3]'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-bold text-gray-900">
                      {option.courier} {option.service}
                    </span>
                    <div className="flex items-center gap-2">
                      {option.isFree && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">
                          Gratis
                        </span>
                      )}
                      {option.isFast && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">
                          Cepat
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">
                      Estimasi {option.estimatedDays}
                    </span>
                    <span className={`text-[14px] font-semibold ${option.isFree ? 'text-green-600' : 'text-gray-900'}`}>
                      {option.isFree ? 'Gratis' : `${safeCurrency} ${option.price.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 7: VOUCHER TOKO (DROPDOWN) */}
        <div className="px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => setShowVoucherDropdown(!showVoucherDropdown)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium text-gray-900">Voucher Toko</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showVoucherDropdown ? 'rotate-180' : ''}`} />
          </button>

          {!showVoucherDropdown && selectedVoucherData && (
            <div className="mt-2 px-3 py-2 bg-[#FFF0F3] border border-[#FF2442] rounded-lg">
              <span className="text-[14px] font-bold text-[#FF2442]">
                Hemat {safeCurrency} {selectedVoucherData.discount.toLocaleString('id-ID')}
              </span>
              <span className="ml-2 px-2 py-0.5 bg-[#FF2442] text-white text-[10px] rounded font-bold">
                {selectedVoucherData.code}
              </span>
            </div>
          )}

          {showVoucherDropdown && (
            <div className="mt-3 space-y-2">
              {product.vouchers?.map((voucher) => (
                <button
                  key={voucher.id}
                  onClick={() => {
                    setSelectedVoucher(selectedVoucher === voucher.id ? null : voucher.id);
                    setShowVoucherDropdown(false);
                  }}
                  className={`w-full p-3 border rounded-lg text-left transition-all ${
                    selectedVoucher === voucher.id
                      ? 'border-[#FF2442] bg-[#FFF0F3]'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedVoucher === voucher.id
                        ? 'bg-[#FF2442]'
                        : 'border-2 border-gray-300'
                    }`}>
                      {selectedVoucher === voucher.id && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <span className="text-[15px] font-bold text-[#FF2442]">
                        Hemat {safeCurrency} {voucher.discount.toLocaleString('id-ID')}
                      </span>
                      
                      <span className="ml-2 px-2 py-0.5 bg-[#FF2442] text-white text-[10px] rounded font-bold">
                        {voucher.code}
                      </span>
                      
                      <p className="text-[12px] text-gray-600 mt-1">
                        {voucher.description}
                      </p>
                      
                      <p className="text-[11px] text-gray-400 mt-1">
                        Min. pembelian {safeCurrency} {voucher.minPurchase.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 8: METODE PEMBAYARAN (DROPDOWN) */}
        <div className="px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium text-gray-900">Metode Pembayaran</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showPaymentDropdown ? 'rotate-180' : ''}`} />
          </button>

          {!showPaymentDropdown && selectedPayment && (
            <div className="mt-2 px-3 py-2 bg-[#FFF0F3] border border-[#FF2442] rounded-lg text-[14px]">
              {paymentMethods.find(p => p.id === selectedPayment)?.icon}{' '}
              <span className="font-medium">{paymentMethods.find(p => p.id === selectedPayment)?.name}</span>
            </div>
          )}

          {showPaymentDropdown && (
            <div className="mt-3 space-y-2">
              {paymentMethods.map((payment) => (
                <button
                  key={payment.id}
                  onClick={() => {
                    setSelectedPayment(payment.id);
                    setShowPaymentDropdown(false);
                  }}
                  className={`w-full p-3 border rounded-lg text-left transition-all ${
                    selectedPayment === payment.id
                      ? 'border-[#FF2442] bg-[#FFF0F3]'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{payment.icon}</span>
                      <span className="text-[14px] text-gray-900">{payment.name}</span>
                    </div>
                    {selectedPayment === payment.id && (
                      <div className="w-5 h-5 bg-[#FF2442] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-24" />
      </div>

      {/* SECTION 9: BOTTOM BAR (FIXED) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-medium text-gray-900">Total</span>
            {voucherDiscount > 0 && (
              <span className="text-[11px] text-red-600 font-medium">
                Kupon: {formatTime(timeLeft)}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowDetailDropdown(!showDetailDropdown)}
            className="flex items-center gap-1 text-[13px] text-[#FF2442] font-medium"
          >
            Detail
            <span className={`transition-transform ${showDetailDropdown ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>

        {showDetailDropdown && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg text-[12px] space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">{safeCurrency} {basePrice.toLocaleString('id-ID')}</span>
            </div>
            {voucherDiscount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Diskon:</span>
                <span>-{safeCurrency} {voucherDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}
            {shippingCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Ongkir:</span>
                <span className="text-gray-900">{safeCurrency} {shippingCost.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-gray-200 font-semibold">
              <span className="text-gray-900">Total:</span>
              <span className="text-[#FF2442]">{safeCurrency} {finalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={!selectedSize || !selectedShipping || !selectedPayment}
          className={`w-full h-11 rounded-full text-[15px] font-semibold transition-all ${
            selectedSize && selectedShipping && selectedPayment
              ? 'bg-[#FF2442] text-white hover:bg-[#E61E3A]'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          Bayar {safeCurrency} {Math.floor(finalPrice / 1000).toLocaleString('id-ID')}
        </button>
      </div>
    </>
  );
}
