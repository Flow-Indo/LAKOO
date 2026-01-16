import { Metadata } from 'next';
import { ProductCard } from '@/components/product/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Products | LAKOO',
  description: 'Browse our collection of products',
};

export default function ProductsPage() {
  // TODO: Fetch products from API
  const products = MOCK_PRODUCTS;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-gray-600">Discover our amazing collection of products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}