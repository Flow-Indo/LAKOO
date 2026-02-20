import { RecommendationsSection } from './RecommendationsSection';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  badges?: Array<'hot' | 'new' | 'sale'>;
}

interface CustomersAlsoViewedProps {
  products: Product[];
}

export function CustomersAlsoViewed({ products }: CustomersAlsoViewedProps) {
  return (
    <RecommendationsSection
      title="Customers Also Viewed"
      products={products}
    />
  );
}