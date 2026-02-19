 'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';

interface Props {
  onDelete?: () => void;
  ariaLabel?: string;
  /** optional controlled quantity */
  quantity?: number;
  /** callback when quantity changes */
  onQuantityChange?: (qty: number) => void;
  /** number of quick options shown (default 4) */
  maxQuickOptions?: number;
}

export default function CartTrash({
  onDelete,
  ariaLabel = 'Hapus',
  quantity: quantityProp,
  onQuantityChange,
  maxQuickOptions = 4,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(quantityProp ?? 1);
  const [isEntering, setIsEntering] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (quantityProp !== undefined) setQuantity(quantityProp);
  }, [quantityProp]);

  useEffect(() => {
    if (isEntering) inputRef.current?.focus();
  }, [isEntering]);

  // close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsEntering(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function selectQty(q: number) {
    setQuantity(q);
    setIsOpen(false);
    setIsEntering(false);
    onQuantityChange?.(q);
  }

  const quickOptions = useMemo(() => {
    if (quantity > 1) {
      // include current qty and nearby options: qty-1, qty, qty+1, qty+2
      const opts = [quantity - 1, quantity, quantity + 1, quantity + 2];
      return Array.from(new Set(opts.filter((n) => n > 0))).sort((a, b) => a - b);
    }
    // default fallback: 1..maxQuickOptions
    return Array.from({ length: maxQuickOptions }, (_, i) => i + 1);
  }, [quantity, maxQuickOptions]);

  function submitCustom(e: React.FormEvent) {
    e.preventDefault();
    const val = Number(inputRef.current?.value ?? '');
    if (!Number.isNaN(val) && val > 0) {
      selectQty(val);
    }
  }

  return (
    <div ref={wrapperRef} className="relative inline-block text-right">
      <div className="mt-1">
        <div className="ml-2 inline-flex items-center gap-0 rounded-md bg-transparent px-[1px] py-[1px] text-sm font-medium text-gray-900 h-[30px]">
          <button
            type="button"
            onClick={() => selectQty(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            className={`inline-flex items-center justify-center w-6 h-6 text-sm ${quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}`}
          >
            −
          </button>

          <span
            className="bg-gray-100 px-3 py-1 rounded-sm text-[12px] font-medium"
          >
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => selectQty(quantity + 1)}
            aria-label="Increase quantity"
            className="inline-flex items-center justify-center w-6 h-6 text-sm"
          >
            +
          </button>
        </div>

          {isOpen && (
            <div className="absolute right-0 z-40 mt-2 w-36 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {quickOptions.map((n) => (
                  <button
                    key={n}
                    onClick={() => selectQty(n)}
                    className={`w-full px-4 py-2 text-left text-sm ${n === quantity ? 'text-red-500' : 'text-gray-900'}`}
                  >
                    {n}
                  </button>
                ))}
                <div className="border-t">
                  {!isEntering ? (
                    <button
                      onClick={() => setIsEntering(true)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-500"
                    >
                      Enter Qty
                    </button>
                  ) : (
                    <form onSubmit={submitCustom} className="px-4 py-3">
                      <input
                        ref={inputRef}
                        defaultValue={quantity}
                        type="number"
                        min={1}
                        className="w-full rounded border px-2 py-1 text-sm"
                        aria-label="Enter quantity"
                      />
                      <div className="mt-2 flex gap-2">
                        <button type="submit" className="flex-1 rounded bg-red-500 py-1 text-sm text-white">
                          OK
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEntering(false);
                          }}
                          className="flex-1 rounded border py-1 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

