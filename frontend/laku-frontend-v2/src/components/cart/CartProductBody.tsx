 'use client';

import React, { useState, useRef, useEffect } from 'react';
import CartSelectButton from './CartSelectButton';
import type { CartProduct, StoreCart } from '@/types/cart';
import { CartStoreAvatar } from './CartStoreAvatar';
import { CartStoreName } from './CartStoreName';
import { CartStoreVariations } from './CartStoreVariations';
import { CartStorePrice } from './CartStorePrice';
import CartTrash from './CartTrash';
import { Search as ScanSearch, Heart, Trash2 } from 'lucide-react';

interface Props {
  product: CartProduct;
  store: StoreCart;
  onToggle?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  onQuantityChange?: (productId: string, quantity: number) => void;
}

export function CartProductBody({ product, store, onToggle, onDelete, onQuantityChange }: Props) {
  const ACTIONS_WIDTH = 216; // 3 actions * 72px
  const SENSITIVITY = 1; // multiply pointer delta to make swipe more sensitive
  const SNAP_THRESHOLD_FACTOR = 0.3; // fraction of ACTIONS_WIDTH to snap open
  const contentRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef<number | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const animTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // reset translate when product changes
    setTranslateX(0);
  }, [product.id, product.quantity]);

  function onPointerDown(e: any) {
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? null;
    setIsDragging(true);
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    try {
      contentRef.current?.setPointerCapture?.(e.pointerId);
    } catch {}
  }

  function onPointerMove(e: any) {
    if (!isDragging || startXRef.current === null) return;
    const currentX = e.clientX ?? e.touches?.[0]?.clientX;
    const dx = currentX - startXRef.current;
    const adjusted = dx * SENSITIVITY;
    const newTranslate = Math.max(-ACTIONS_WIDTH, Math.min(0, adjusted));
    setTranslateX(newTranslate);
  }

  function onPointerUp(e: any) {
    setIsDragging(false);
    const clientX = e?.clientX ?? e?.touches?.[0]?.clientX ?? null;
    const dx = clientX !== null && startXRef.current !== null ? clientX - startXRef.current : 0;
    const rightSwipe = dx > 5; // small rightward move counts as intent to close
    const snapThreshold = ACTIONS_WIDTH * SNAP_THRESHOLD_FACTOR;
    const target = rightSwipe ? 0 : (translateX < -snapThreshold ? -ACTIONS_WIDTH : 0);
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    // Use DOM-controlled transition to avoid React batching issues on Mobile Safari
    if (contentRef.current) {
      contentRef.current.style.transition = 'transform 380ms cubic-bezier(0.2,0.8,0.2,1)';
      // force layout flush
      void contentRef.current.getBoundingClientRect();
      // apply transform on next frame; if current == target nudge 1px so browser will animate
      requestAnimationFrame(() => {
        if (!contentRef.current) return;
        if (Math.abs(translateX - target) < 0.5) {
          const nudge = target === 0 ? -1 : 1;
          contentRef.current.style.transform = `translateX(${target + nudge}px)`;
          // flush and then set to real target to animate
          void contentRef.current.getBoundingClientRect();
          requestAnimationFrame(() => {
            contentRef.current && (contentRef.current.style.transform = `translateX(${target}px)`);
          });
        } else {
          contentRef.current.style.transform = `translateX(${target}px)`;
        }
      });
      animTimerRef.current = window.setTimeout(() => {
        // sync React state and clear inline styles
        setTranslateX(target);
        if (contentRef.current) {
          contentRef.current.style.transition = '';
          contentRef.current.style.transform = '';
        }
        animTimerRef.current = null;
      }, 420);
    } else {
      // fallback: set state directly
      setTranslateX(target);
    }
    startXRef.current = null;
  }

  function handleDelete() {
    onDelete && onDelete(product.id);
  }

  return (
    <>
      <div className="px-4 pt-[10px] pb-[10px] border-b-0 overflow-hidden">
        <div className="relative">
          <div
            className="absolute inset-y-0 right-0 flex z-0"
            style={{ width: `${ACTIONS_WIDTH}px`, minWidth: `${ACTIONS_WIDTH}px` }}
          >
            <button
              onClick={() => console.log('find similar')}
              className="w-24 text-white flex flex-col items-center justify-center"
              aria-label="Find similar"
              style={{ backgroundColor: '#fd5267' }}
            >
              <ScanSearch className="w-5 h-5" />
              <span className="text-xs mt-1">Serupa</span>
            </button>
            <button
              onClick={() => console.log('add wishlist')}
              className="w-24 text-white flex flex-col items-center justify-center"
              aria-label="Add to wishlist"
              style={{ backgroundColor: '#fdbb56' }}
            >
              <Heart className="w-5 h-5" />
              <span className="text-xs mt-1">Wishlist</span>
            </button>
            <button
              onClick={handleDelete}
              className="w-24 text-white flex flex-col items-center justify-center"
              aria-label="Delete"
              style={{ backgroundColor: '#fe2243' }}
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-xs mt-1">Hapus</span>
            </button>
          </div>

          <div
            ref={contentRef}
            className={`flex items-start gap-3 bg-white relative z-10 w-full`}
            style={{
              transform: `translateX(${translateX}px)`,
              transition: 'none',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClick={(e) => {
              // If row is swiped open, prevent clicks from closing it —
              // require explicit swipe-right to close.
              if (Math.abs(translateX) > 10) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <div className="self-center">
              <CartSelectButton
                selected={product.isSelected}
                onClick={() => onToggle && onToggle(product.id)}
                sizeClass="w-4 h-4 sm:w-6 sm:h-6"
                ariaLabel="Select product"
              />
            </div>

            <div className="w-20 h-20 rounded-[5px] overflow-hidden flex-none">
              <img src={product.image} alt={product.name} className="object-cover w-full h-full block" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[80px]">
              <div>
                <CartStoreName name={product.name} />
                <CartStoreVariations variations={product.variations} />
              </div>

              <div className="text-left flex items-center justify-between">
                <CartStorePrice price={product.price} originalPrice={product.originalPrice} />
                <CartTrash
                  onDelete={() => onDelete && onDelete(product.id)}
                  quantity={product.quantity}
                  onQuantityChange={(q: number) => onQuantityChange && onQuantityChange(product.id, q)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

