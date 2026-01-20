import { HomePageClient } from './HomePageClient';

export default async function HomePage() {
  // TODO: Replace with your real API endpoint
  const products = await fetch('http://localhost:3000/api/products', {
    next: { revalidate: 3600 } // Cache for 1 hour
  }).then(r => r.json()).catch(() => []); // Fallback to empty array if API fails

  return <HomePageClient initialProducts={products} />;
}