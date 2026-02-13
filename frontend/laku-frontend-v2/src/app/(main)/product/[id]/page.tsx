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
  // Handle special case for WEAR THREEK (should be 'wearthreek' not 'wear-threek')
  let storeSlug = product.brand.toLowerCase().replace(/\s+/g, '-');

  // Special mapping for brand names to store slugs
  const brandToStoreSlug: Record<string, string> = {
    'lululemon': 'lululemon',
    'prada': 'prada',
    'maison margiela': 'maisonmargiela',
    'stanley 1913': 'stanley',
    'luxury collection': 'prada', // Combo products link to main luxury brand
    'wearthreek': 'wearthreek',
    'cult suri': 'cult-suri',
    'karakiri': 'karakiri',
    'rue': 'rue',
  };

  // Use the mapping if it exists
  const normalizedBrand = product.brand.toLowerCase();
  if (brandToStoreSlug[normalizedBrand]) {
    storeSlug = brandToStoreSlug[normalizedBrand];
  }
  
  // Check if there's a store with the hyphenated version
  if (storesData[storeSlug]) {
    // good, use this slug
  } else {
    // Try without hyphen (for WEAR THREEK -> wearthreek)
    const noHyphenSlug = product.brand.toLowerCase().replace(/\s+/g, '');
    if (storesData[noHyphenSlug]) {
      storeSlug = noHyphenSlug;
    }
  }
  
  const storeInfo = storesData[storeSlug] || {};
  
  const seller = {
    id: storeSlug, // Use just the slug for correct linking (e.g., "cult-suri")
    name: product.brand,
    logo: product.productImages[0] || '/viena/atasan1-removebg-preview.png', // Use main product image as store logo
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

  // Store products for recommendations (using real product slugs)
  const storeProducts = [
    {
      id: 'cult-suri-1',
      name: 'CULT SURI - Coco Top Chiffon Dengan Scarf Detail',
      image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor1.webp',
      price: 249000,
      originalPrice: 349000,
      rating: 4.7,
      sold: '2.1K',
    },
    {
      id: 'cult-suri-2',
      name: 'CULT SURI - Coco Top Chiffon Dengan Scarf Detail',
      image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor2.webp',
      price: 189000,
      rating: 4.5,
      sold: '890',
    },
    {
      id: 'karakiri-1',
      name: 'Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants',
      image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor1.webp',
      price: 159000,
      rating: 4.6,
      sold: '1.5K',
    },
    {
      id: 'karakiri-2',
      name: 'Karakiri - Wide Leg Trousers',
      image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor2.webp',
      price: 99000,
      rating: 4.4,
      sold: '3.2K',
    },
    {
      id: 'rue-1',
      name: 'RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve',
      image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor1.webp',
      price: 279000,
      originalPrice: 359000,
      rating: 4.8,
      sold: '1.2K',
    },
    {
      id: 'rue-2',
      name: 'RUE - Boatneck Longsleeve Top',
      image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor2.webp',
      price: 199000,
      rating: 4.6,
      sold: '2.8K',
    },
    // New Lululemon products
    {
      id: 'lulu-softstreme-1',
      name: 'Lululemon - Softstreme Zip-Flared Pant',
      image: '/products/Lululemon - Softstreme Zip-Flared Pant/softstreme_eksplor1.webp',
      price: 1280000,
      originalPrice: 1580000,
      rating: 4.9,
      sold: '2.3K',
    },
    {
      id: 'lulu-swiftly-1',
      name: 'Lululemon - Swiftly Tech Long Sleeve 2.0',
      image: '/products/Lululemon - Swiftly Tech Long Sleeve/swiftly_eksplor1.webp',
      price: 780000,
      originalPrice: 980000,
      rating: 4.9,
      sold: '5.6K',
    },
    {
      id: 'lulu-combo-1',
      name: 'Lululemon - Softstreme + Swiftly Combo',
      image: '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_eksplor1.webp',
      price: 2060000,
      originalPrice: 2560000,
      rating: 4.9,
      sold: '1.2K',
    },
    // New Prada products
    {
      id: 'prada-tote-1',
      name: 'Prada - Black Medium Leather Tote Bag',
      image: '/products/Prada - Black Medium Leather Tote Bag/prada_eksplor1.webp',
      price: 42500000,
      originalPrice: 48000000,
      rating: 5.0,
      sold: '89',
    },
    // New MM products
    {
      id: 'mm-tabi-1',
      name: 'Maison Margiela - Tabi Leather Ballerina Flats',
      image: '/products/Maison Margiela - Tabi Ballerina Flats/mm_eksplor1.webp',
      price: 18900000,
      originalPrice: 21500000,
      rating: 4.9,
      sold: '45',
    },
    // New Stanley products
    {
      id: 'stanley-quencher-1',
      name: 'Stanley - x Jennie Quencher Luxe 30 OZ',
      image: '/products/Stanley - Jennie Quencher Luxe/stanley_eksplor1.webp',
      price: 850000,
      originalPrice: 980000,
      rating: 4.8,
      sold: '3.2K',
    },
    // Luxury combo
    {
      id: 'luxury-combo-1',
      name: 'Prada + MM + Stanley Luxury Combo',
      image: '/products/Prada+MM+Stanley Combo/combo_eksplor1.webp',
      price: 63350000,
      originalPrice: 70500000,
      rating: 5.0,
      sold: '18',
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
