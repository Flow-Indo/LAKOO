'use server';

import { Product } from '@/types';
import { MOCK_PRODUCTS } from './mock-data';

// Simulate pagination for infinite scroll
export async function fetchMoreProductsAction(offset: number, limit: number): Promise<Product[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Generate additional products for infinite scroll demo
  const additionalProducts: Product[] = [];
  const startId = MOCK_PRODUCTS.length + offset + 1;

  for (let i = 0; i < limit; i++) {
    const id = (startId + i).toString();
    const productIndex = i % MOCK_PRODUCTS.length;
    const baseProduct = MOCK_PRODUCTS[productIndex];

    // Create deterministic variations based on id
    const variation = parseInt(id) % 10;

    additionalProducts.push({
      ...baseProduct,
      id,
      name: `${baseProduct.name} (${id})`,
      slug: `${baseProduct.slug}-${id}`,
      image: baseProduct.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      sold: (baseProduct.sold || 0) + variation * 10,
      price: baseProduct.price + variation * 5000,
    });
  }

  return additionalProducts;
}
