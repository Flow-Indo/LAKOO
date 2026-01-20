'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cart-store';

interface QuantityStepperProps {
  productId: string;
  initialQuantity: number;
  className?: string;
}

export default function QuantityStepper({
  productId,
  initialQuantity,
  className,
}: QuantityStepperProps) {
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const [optimisticQuantity, setOptimisticQuantity] = useState<number>(initialQuantity);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // keep in sync if store changes externally
    setOptimisticQuantity(initialQuantity);
  }, [initialQuantity]);

  async function applyQuantity(newQuantity: number) {
    // optimistic update
    const previous = optimisticQuantity;
    setOptimisticQuantity(newQuantity);
    setIsUpdating(true);
    try {
      // call store update (synchronous in this repo) but keep async shape for rollback
      await Promise.resolve(updateQuantity(productId, newQuantity));
    } catch (err) {
      // rollback on error
      setOptimisticQuantity(previous);
      // Ideally surface error to user (toast) — omitted to keep components self-contained
    } finally {
      setIsUpdating(false);
    }
  }

  const onIncrement = () => {
    applyQuantity(optimisticQuantity + 1);
  };

  const onDecrement = () => {
    if (optimisticQuantity <= 1) return;
    applyQuantity(optimisticQuantity - 1);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value || '0', 10);
    if (isNaN(value) || value < 1) return;
    // debounce not implemented here; parent can debounce if needed
    applyQuantity(value);
  };

  return (
    <div className={`inline-flex items-center border rounded-md overflow-hidden ${className || ''}`}>
      <button
        aria-label="decrease quantity"
        className="px-2 py-1 text-sm disabled:opacity-40"
        onClick={onDecrement}
        disabled={isUpdating || optimisticQuantity <= 1}
      >
        −
      </button>
      <input
        aria-label="quantity"
        className="w-12 text-center text-sm outline-none"
        value={optimisticQuantity}
        onChange={onChangeInput}
        inputMode="numeric"
      />
      <button
        aria-label="increase quantity"
        className="px-2 py-1 text-sm"
        onClick={onIncrement}
        disabled={isUpdating}
      >
        +
      </button>
    </div>
  );
}

