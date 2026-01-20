import { AppLayout } from '@/components/layouts';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // TODO: Fetch product data based on slug
  // For now, we'll just show a placeholder

  if (!slug) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Product: {slug}</h1>
          <p className="text-gray-600">Product details will be loaded here...</p>
        </div>
      </div>
    </AppLayout>
  );
}