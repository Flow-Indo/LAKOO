import { notFound } from 'next/navigation';
import { StoreClient } from '@/components/store/StoreClient';
import { mockStore } from '@/lib/mock-store-data';

interface Props {
  params: Promise<{ sellerId: string }>;
}

export default async function StorePage({ params }: Props) {
  const { sellerId } = await params;

  // In a real app, this would be an API call
  // const store = await fetchStore(sellerId);
  const store = mockStore;

  if (!store || store.id !== sellerId) {
    notFound();
  }

  return <StoreClient store={store} />;
}

export async function generateMetadata({ params }: Props) {
  const { sellerId } = await params;
  const store = mockStore; // In real app, fetch from API

  if (!store) {
    return {
      title: 'Store Not Found | LAKU',
    };
  }

  return {
    title: store.seo.title,
    description: store.seo.description,
    keywords: store.seo.keywords,
    openGraph: {
      title: store.seo.title,
      description: store.seo.description,
      images: [store.banner || store.logo],
      type: 'website',
    },
  };
}