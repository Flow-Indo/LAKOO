'use client';

import { useEffect } from 'react';

export default function AnalyticsTracker({ product }: { product: any }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_item', {
        currency: 'IDR',
        value: product.salePrice,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            price: product.salePrice,
            quantity: 1,
          },
        ],
      });
    }
  }, [product]);

  return null;
}

