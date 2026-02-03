'use client';

import { useState } from 'react';
import { CheckoutModalProps, CheckoutState } from '@/types/checkout';

import CheckoutHeader from './sections/CheckoutHeader';
import AddressSection from './sections/AddressSection';
import ProductInfo from './sections/ProductInfo';
import ColorSelector from './sections/ColorSelector';
import SizeSelector from './sections/SizeSelector';
import SellerNote from './sections/SellerNote';
import ShippingOptions from './sections/ShippingOptions';
import VoucherSection from './sections/VoucherSection';
import PaymentMethod from './sections/PaymentMethod';
import CheckoutFooter from './sections/CheckoutFooter';

export default function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const [state, setState] = useState<CheckoutState>({
    selectedColor: product.colors[0]?.id || null,
    selectedSize: null,
    quantity: 1,
    note: '',
    selectedShipping: null,
    selectedVoucher: null,
    selectedPayment: null,
  });

  const updateState = (updates: Partial<CheckoutState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const calculatePricing = () => {
    const selectedSizeObj = product.sizes.find(s => s.id === state.selectedSize);
    const basePrice = (selectedSizeObj?.price || product.price) * state.quantity;
    const originalPrice = product.originalPrice ? product.originalPrice * state.quantity : basePrice;

    const selectedVoucher = product.vouchers.find(v => v.id === state.selectedVoucher);
    const discount = selectedVoucher
      ? selectedVoucher.discountType === 'percentage'
        ? Math.min((basePrice * selectedVoucher.discount) / 100, selectedVoucher.maxDiscount || Infinity)
        : selectedVoucher.discount
      : 0;

    const shipping = product.shippingOptions.find(s => s.id === state.selectedShipping);
    const shippingCost = shipping?.price || 0;

    return {
      subtotal: basePrice,
      discount,
      shipping: shippingCost,
      total: basePrice - discount + shippingCost,
    };
  };

  const handleCheckout = () => {
    if (!state.selectedSize) {
      alert('Silakan pilih ukuran');
      return;
    }
    if (!state.selectedShipping) {
      alert('Silakan pilih opsi pengiriman');
      return;
    }
    if (!state.selectedPayment) {
      alert('Silakan pilih metode pembayaran');
      return;
    }

    const orderData = {
      product: {
        id: product.id,
        name: product.name,
        colorId: state.selectedColor,
        sizeId: state.selectedSize,
      },
      quantity: state.quantity,
      note: state.note,
      shippingId: state.selectedShipping,
      voucherId: state.selectedVoucher,
      paymentId: state.selectedPayment,
      pricing: calculatePricing(),
    };

    console.log('🛒 Checkout Order:', orderData);
    alert('Checkout berhasil! (Demo mode)');
    onClose();
  };

  const pricing = calculatePricing();
  const canCheckout = !!(state.selectedSize && state.selectedShipping && state.selectedPayment);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal Container */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Scrollable Content */}
        <div className="pb-0">
          {/* Section 1: Header */}
          <CheckoutHeader onClose={onClose} />

          {/* Section 1.5: Address */}
          <AddressSection />

          {/* Main Content with INCREASED Spacing - space-y-8 (32px) */}
          <div className="px-6 py-0">
            {/* Section 2: Product Info WITH Quantity */}
            <ProductInfo
              product={product}
              selectedColor={state.selectedColor}
              selectedSize={state.selectedSize}
              quantity={state.quantity}
              onQuantityChange={(qty) => updateState({ quantity: qty })}
            />

            {/* Section 3: Colors (Redesigned) */}
            <ColorSelector
              colors={product.colors}
              selectedColor={state.selectedColor}
              onSelect={(colorId) => updateState({ selectedColor: colorId })}
            />

            {/* Section 4: Sizes (No quantity) */}
            <SizeSelector
              sizes={product.sizes}
              selectedSize={state.selectedSize}
              onSelectSize={(sizeId) => updateState({ selectedSize: sizeId })}
            />

            {/* Section 5: Note */}
            <SellerNote
              note={state.note}
              onChange={(note) => updateState({ note })}
            />

            {/* Section 6: Shipping */}
            <ShippingOptions
              options={product.shippingOptions}
              selected={state.selectedShipping}
              onSelect={(id) => updateState({ selectedShipping: id })}
            />

            {/* Section 7: Voucher */}
            <VoucherSection
              vouchers={product.vouchers}
              selected={state.selectedVoucher}
              onSelect={(id) => updateState({ selectedVoucher: id })}
            />

            {/* Section 8: Payment */}
            <PaymentMethod
              selected={state.selectedPayment}
              onSelect={(id) => updateState({ selectedPayment: id })}
            />
          </div>
        </div>

        {/* Section 9: Fixed Footer */}
        <CheckoutFooter
          pricing={pricing}
          onCheckout={handleCheckout}
          canCheckout={canCheckout}
        />
      </div>
    </>
  );
}
