// src/app/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import MobileProductPage from '@/components/product/MobileProductPageMain';
import DesktopProductPage from '@/components/product/DesktopProductPage';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProductSlugs } from '@/lib/products-data';
import { storesData } from '@/lib/stores-data';

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

  // Raw image URLs for checkout modal
  const imageUrls = product.productImages;

  // Convert colors to the expected format
  const colors = product.productData.colors.map((color: string, index: number) => ({
    id: `color-${index + 1}`,
    name: color,
    image: '', // No color-specific images, will use main image
    isHot: index === 0, // First color is marked as hot
  }));

  // Create seller data
  const storeSlug = product.brand.toLowerCase().replace(/\s+/g, '-');
  const storeInfo = storesData[storeSlug] || {};
  
  const seller = {
    id: `store-${storeSlug}`,
    name: product.brand,
    logo: `/stores/${storeSlug}-logo.jpg`,
    rating: product.productData.rating,
    followers: storeInfo.followers || 50000,
    totalSold: storeInfo.totalSold || 0,
    badges: ['verified', 'trusted', 'premium', 'top', 'star'] as const,
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

    // Transform color variants for checkout modal
  const colorVariants = product.colors.map((color: any) => ({
    id: color.id,
    name: color.name,
    image: color.image,
    stock: color.stock,
    label: color.label,
  }));

  // Transform size variants for checkout modal
  const sizeVariants = product.sizes.map((size: any) => ({
    id: size.id,
    name: size.name,
    price: size.price,
    weight: size.weight,
    weightRecommendation: size.weightRecommendation,
    measurements: size.measurements,
  }));

  // Transform shipping options for checkout modal
  const shippingOptions = product.shippingOptions.map((option: any) => ({
    id: option.id,
    name: option.name,
    courier: option.courier,
    service: option.service,
    price: option.price,
    estimatedDays: option.estimatedDays,
    isFree: option.isFree,
    isFast: option.isFast,
    description: `${option.courier} ${option.service} - ${option.estimatedDays}`,
  }));

  // Transform vouchers for checkout modal
  const vouchers = product.vouchers.map((voucher: any) => ({
    id: voucher.id,
    code: voucher.code,
    discount: voucher.discount,
    discountType: voucher.discountType,
    minPurchase: voucher.minPurchase,
    maxDiscount: voucher.maxDiscount,
    validUntil: voucher.validUntil,
    description: voucher.description,
  }));

  // Mock store products for recommendations
  const storeProducts = [
    {
      id: 'rec-001',
      name: product.brand + ' - Summer Beach Dress',
      image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor1.webp',
      price: 249000,
      originalPrice: 349000,
      rating: 4.7,
      sold: '2.1K',
    },
    {
      id: 'rec-002',
      name: product.brand + ' - Floral Blouse',
      image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor2.webp',
      price: 189000,
      rating: 4.5,
      sold: '890',
    },
    {
      id: 'rec-003',
      name: product.brand + ' - Denim Shorts',
      image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor1.webp',
      price: 159000,
      rating: 4.6,
      sold: '1.5K',
    },
    {
      id: 'rec-004',
      name: product.brand + ' - Sandals',
      image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor2.webp',
      price: 99000,
      rating: 4.4,
      sold: '3.2K',
    },
    {
      id: 'rec-005',
      name: product.brand + ' - Casual Pants',
      image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor1.webp',
      price: 279000,
      originalPrice: 359000,
      rating: 4.8,
      sold: '1.2K',
    },
    {
      id: 'rec-006',
      name: product.brand + ' - Top Collection',
      image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor2.webp',
      price: 199000,
      rating: 4.6,
      sold: '2.8K',
    },
  ];

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
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
    price: product.price,
    originalPrice: product.originalPrice || product.price,
    discountPercentage: discountPercentage,
    currency: product.currency || 'Rp',
    colors: colors, // Use transformed colors with id, name, image, isHot
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
    storeProducts: storeProducts,
    buyerReferences: [], // Empty for now
    relatedProducts: [], // Empty for now
    reviews: [], // Empty for now
    recommendations: [], // Empty for now
    images: images,
    // Checkout modal data - using correct field names for StickyBottomBar
    imageUrls: imageUrls, // Raw URLs for checkout modal color grid
    sizeVariants: sizeVariants,
    shippingOptions: shippingOptions,
    vouchers: vouchers,
    mainImage: product.productImages[0] || product.postImages[0],
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
