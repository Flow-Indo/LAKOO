import { AppLayout } from '@/components/layouts';
import { notFound } from 'next/navigation';

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  // TODO: Fetch order data based on id
  // For now, we'll just show a placeholder

  if (!id) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Order #{id}</h1>
          <p className="text-gray-600">Order details will be loaded here...</p>
        </div>
      </div>
    </AppLayout>
  );
}