// src/app/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import MobileProductPage from '@/components/product/MobileProductPageMain';
import DesktopProductPage from '@/components/product/DesktopProductPage';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProductSlugs } from '@/lib/products-data';

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductBySlug(id);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan | Laku',
    };
  }

  return {
    title: `${product.brand} - ${product.name} | Laku`,
    description: product.description,
    openGraph: {
      title: `${product.brand} - ${product.name}`,
      description: product.description,
      images: [product.productImages[0]],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.brand} - ${product.name}`,
      description: product.description,
      images: [product.productImages[0]],
    },
  };
}

// Transform product data to match DesktopProductPage expected structure
function transformToProductPageData(product: any) {
  // Convert product images to the expected format
  const images = product.productImages.map((url: string, index: number) => ({
    id: `img-${index + 1}`,
    url: url,
    thumbnail: url,
    alt: `${product.name} - Image ${index + 1}`,
  }));

  // Convert colors to the expected format
  const colors = product.productData.colors.map((color: string, index: number) => ({
    id: `color-${index + 1}`,
    name: color,
    image: '', // No color-specific images, will use main image
    isHot: index === 0, // First color is marked as hot
  }));

  // Create seller data
  const seller = {
    id: `store-${product.brand.toLowerCase().replace(/\s+/g, '-')}`,
    name: product.brand,
    logo: `/stores/${product.brand.toLowerCase().replace(/\s+/g, '-')}-logo.jpg`,
    rating: product.productData.rating,
    followers: 50000,
    badges: ['verified', 'trusted'] as ['verified', 'trusted', 'premium', 'top', 'star'],
    verified: true,
    productCount: product.productData.sizes.length * product.productData.colors.length,
    stats: {
      newReviews: '6 bulan terakhir tambah 1rb ulasan bagus',
      storeAge: '2 tahun toko terpercaya',
      vipAdditions: '6 bulan terakhir 3rb member VIP belanja',
    },
    metrics: {
      productQuality: {
        score: 4.8,
        level: 'Tinggi',
        detail: '90 hari terakhir tambah 70 ulasan bagus',
      },
      shippingSpeed: {
        score: 4.5,
        level: 'Sedang',
        detail: 'Rata-rata 15 jam kirim barang',
      },
      serviceQuality: {
        score: 4.3,
        level: 'Sedang',
        detail: 'Rata-rata 3 hari proses refund',
      },
    },
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return {
    id: product.id,
    name: product.name,
    subtitle: product.productData.subtitle || product.description.substring(0, 50),
    category: product.productData.category,
    categorySlug: product.productData.categorySlug,
    subcategory: product.productData.subcategory,
    subcategorySlug: product.productData.subcategorySlug,
    sku: product.productData.sku,
    rating: product.productData.rating,
    reviewCount: product.productData.reviewCount,
    sold: parseInt(product.productData.sold.replace(/[^0-9]/g, '')) * (product.productData.sold.includes('K') ? 1000 : 1),
    stock: product.productData.stock,
    salePrice: product.price,
    originalPrice: product.originalPrice || product.price,
    discountPercentage: discountPercentage,
    colors: colors,
    sizes: product.productData.sizes,
    availableSizes: product.productData.sizes, // All sizes available
    description: product.description,
    material: '80% Katun, 20% Polyester',
    pattern: 'Polos',
    style: 'Kasual, Street',
    fit: 'Regular Fit',
    sizeChart: product.productData.sizes.map((size: string) => ({
      size: size,
      height: '170',
      weight: '60',
      waist: '76',
      hip: '98',
      inseam: '61.5',
    })),
    seller: seller,
    badges: product.productData.badges || [],
    storeProducts: [], // Empty for now
    buyerReferences: [], // Empty for now
    relatedProducts: [], // Empty for now
    reviews: [], // Empty for now
    recommendations: [], // Empty for now
    images: images,
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const product = getProductBySlug(id);

  if (!product) {
    notFound();
  }

  // Transform product data to match expected structure
  const productPageData = transformToProductPageData(product);

  // DON'T wrap in new layout - use existing app layout
  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileProductPage product={productPageData} />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <DesktopProductPage product={productPageData} />
      </div>
    </>
  );
}
