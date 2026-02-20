import { notFound } from 'next/navigation';
import { StoreClient } from '@/components/store/StoreClient';
import { mockStore } from '@/lib/mock-store-data';
import { getStoreBySlug, getStoreProducts } from '@/lib/stores-data';
import type { Store } from '@/types/store';

interface Props {
  params: Promise<{ sellerId: string }>;
}

export default async function StorePage({ params }: Props) {
  const { sellerId } = await params;

  // Try to find store in our stores-data first
  const brandStore = getStoreBySlug(sellerId);

  if (brandStore) {
    // Convert StoreData to Store format for StoreClient
    const store: Store = {
      id: brandStore.id,
      name: brandStore.name,
      logo: brandStore.logoImage,
      banner: brandStore.coverImage,
      verified: true,
      rating: brandStore.rating,
      productCount: brandStore.productsCount,
      followers: brandStore.followers,
      description: brandStore.description,
      location: brandStore.location,
      joinedDate: new Date(brandStore.story.founded),
      isFollowing: false,
      performance: {
        productQuality: brandStore.rating,
        shippingSpeed: 4.5,
        customerService: 4.8,
        responseRate: 98,
        shipOnTimeRate: 95,
        returnRate: 2,
        customerSatisfaction: 94
      },
      badges: [
        { id: 'brand-1', name: 'Brand Store', type: 'verified' }
      ],
      stats: {
        totalSales: `${(brandStore.productsCount * 100)}K+`,
        repurchaseRate: `${(brandStore.followers / 1000).toFixed(0)}K+`,
        responseTime: 'within 1 hour',
        yearsActive: new Date().getFullYear() - parseInt(brandStore.story.founded)
      },
      categories: brandStore.categories.map((cat, idx) => ({
        id: `cat-${idx}`,
        name: cat,
        productCount: Math.floor(brandStore.productsCount / brandStore.categories.length)
      })),
      products: getStoreProducts(brandStore).map((product) => ({
        id: product.id,
        name: product.name,
        image: product.productImages[0],
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.productData.discountPercentage,
        rating: product.productData.rating,
        reviewCount: product.productData.reviewCount,
        sold: product.productData.sold,
        category: product.productData.category,
        tags: [],
        shipping: { free: true, express: true }
      })),
      collections: [],
      reviews: [],
      policies: {
        cod: true,
        return: true,
        returnPeriod: 7,
        shipping: true,
        warranty: true
      },
      seo: {
        title: `${brandStore.name} - ${brandStore.tagline} - Laku`,
        description: brandStore.description,
        keywords: [brandStore.name, ...brandStore.categories]
      }
    };

    return <StoreClient store={store} />;
  }

  // Fallback to mockStore for other stores
  const store = mockStore;

  // debug: log params and mock store id to server console
  // eslint-disable-next-line no-console
  console.log('StorePage debug - sellerId:', sellerId, 'mockStore.id:', store?.id);
  if (!store || store.id !== sellerId) {
    notFound();
  }

  return <StoreClient store={store} />;
}

export async function generateMetadata({ params }: Props) {
  const { sellerId } = await params;

  // Try to find store in our stores-data first
  const brandStore = getStoreBySlug(sellerId);

  if (brandStore) {
    return {
      title: `${brandStore.name} - ${brandStore.tagline} - Laku`,
      description: brandStore.description,
      keywords: [brandStore.name, ...brandStore.categories],
      openGraph: {
        title: `${brandStore.name} - ${brandStore.tagline}`,
        description: brandStore.description,
        images: [brandStore.coverImage],
        type: 'website',
      },
    };
  }

  // Fallback to mockStore
  const store = mockStore;

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