import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { mockProduct } from '@/lib/mock-product-data';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  // In a real app, this would be an API call
  // const product = await fetchProduct(id);
  const product = mockProduct;

  if (!product || product.id !== id) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = mockProduct; // In real app, fetch from API

  if (!product) {
    return {
      title: 'Product Not Found | LAKU',
    };
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
    keywords: product.seo.keywords,
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      images: [product.images[0]],
      type: 'website',
    },
  };
}