// src/app/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import MobileProductPage from '@/components/product/MobileProductPageMain';
import DesktopProductPage from '@/components/product/DesktopProductPage';
import type { Metadata } from 'next';

// Indonesian product data with Rupiah currency
async function getProduct(id: string) {
  // Mock Indonesian product data - replace with actual API call later
  return {
    id,
    name: "Celana Olahraga Pria Manfinity Hypermode Loose Fit Test Test Test Test Test Test Test Test Test TestTestTest Test",
    subtitle: "Celana Jogger Street Style Serbaguna",
    category: "Pakaian Pria",
    categorySlug: "pakaian-pria",
    subcategory: "Celana Olahraga",
    subcategorySlug: "celana-olahraga",
    sku: "mf2507194828911584",
    rating: 4.55,
    reviewCount: 100,
    sold: 10000,
    stock: 45,
    salePrice: 189000, // Rupiah
    originalPrice: 270000, // Rupiah
    discountPercentage: 30,
    colors: [
      {
        id: 'beige',
        name: 'Beige',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=80&h=80&fit=crop',
        isHot: true,
      },
      {
        id: 'black',
        name: 'Hitam',
        image: 'https://images.unsplash.com/photo-1506629905607-d2e8b25cbca7?w=80&h=80&fit=crop',
      },
      {
        id: 'grey',
        name: 'Abu-abu',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
      },
      {
        id: 'navy',
        name: 'Navy',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop',
      },
      {
        id: 'olive',
        name: 'Olive',
        image: 'https://images.unsplash.com/photo-1515378791036-856f6f0e0c4b?w=80&h=80&fit=crop',
      },
      {
        id: 'brown',
        name: 'Coklat',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=80&h=80&fit=crop',
      },
    ],
    sizes: ['36 (S)', '38 (M)', '40 (L)', '42 (XL)', '44 (XXL)'],
    availableSizes: ['36 (S)', '38 (M)', '40 (L)', '42 (XL)'], // 44 is out of stock
    description:
      'Celana olahraga serbaguna yang menggabungkan kenyamanan dengan gaya street. Cocok untuk penggunaan sehari-hari, bersantai, atau olahraga ringan. Dilengkapi dengan pinggang elastis dengan tali serut, saku samping, dan potongan longgar yang mengikuti gerakan Anda.',
    material: '80% Katun, 20% Polyester',
    pattern: 'Polos',
    style: 'Kasual, Street, Athleisure',
    fit: 'Loose Fit',
    sizeChart: [
      { size: 'S', height: '170', weight: '50', waist: '76', hip: '98', inseam: '61.5' },
      { size: 'M', height: '174', weight: '60', waist: '80', hip: '102', inseam: '63' },
      { size: 'L', height: '178', weight: '70', waist: '84', hip: '106', inseam: '64.5' },
    ],
    seller: {
      id: 'store-001',
      name: 'DUDACK',
      logo: '/stores/dudack-logo.jpg',
      rating: 4.6,
      followers: 78000,
      badges: ['verified', 'trusted', 'premium', 'top', 'star'],
      stats: {
        newReviews: '6 bulan terakhir tambah 1rb ulasan bagus',
        storeAge: '16 tahun toko terpercaya',
        vipAdditions: '6 bulan terakhir 3rb member VIP belanja'
      },
      metrics: {
        productQuality: {
          score: 5.0,
          level: 'Tinggi',
          detail: '90 hari terakhir tambah 70 ulasan bagus'
        },
        shippingSpeed: {
          score: 4.5,
          level: 'Sedang',
          detail: 'Rata-rata 15 jam kirim barang'
        },
        serviceQuality: {
          score: 4.3,
          level: 'Sedang',
          detail: 'Rata-rata 3 hari proses refund'
        }
      }
    },
    badges: ['Diskon', 'Terlaris'],
    storeProducts: [
      { id: '1', name: 'Celana Panjang Kasual Hitam', image: '/jeans/jean_mock_details/IMG_9981.JPG', price: 219000, sold: 5000 },
      { id: '2', name: 'Celana Cargo Premium', image: '/jeans/jean_mock_details/IMG_9980.JPG', price: 245000, sold: 1000 },
      { id: '3', name: 'Celana Jogger Sporty', image: '/jeans/jean_mock_details/IMG_9978.JPG', price: 254000, sold: 700 },
      { id: '4', name: 'Celana Training Nyaman', image: '/jeans/jean_mock_details/IMG_9977.JPG', price: 263000, sold: 800 },
      { id: '5', name: 'Celana Chino Modern', image: '/jeans/jean_mock_details/IMG_9976.JPG', price: 254000, sold: 300 },
      { id: '6', name: 'Celana Formal Elegan', image: '/jeans/jean_mock_details/IMG_9981.JPG', price: 254000, sold: 200 },
    ],
    buyerReferences: [
      { avatar: '/jeans/jean_mock_reviews/reviews1.JPG', name: '1**', height: '170', weight: '60', purchasedSize: 'S' },
      { avatar: '/jeans/jean_mock_reviews/reviews2.JPG', name: '5**', height: '170', weight: '55', purchasedSize: 'M' },
      { avatar: '/jeans/jean_mock_reviews/reviews3.JPG', name: '6**', height: '172', weight: '52', purchasedSize: 'M' },
      { avatar: '/jeans/jean_mock_details/IMG_9980.JPG', name: '8**', height: '179', weight: '63', purchasedSize: 'L' },
      { avatar: '/jeans/jean_mock_details/IMG_9981.JPG', name: '零**', height: '178', weight: '71', purchasedSize: 'L' },
      { avatar: '/jeans/jean_mock_details/IMG_9978.JPG', name: '7**', height: '178', weight: '68', purchasedSize: 'L' },
      { avatar: '/jeans/jean_mock_details/IMG_9977.JPG', name: '3**', height: '181', weight: '86', purchasedSize: 'XL' },
    ],
    relatedProducts: [
      { id: 'r1', name: 'Celana Denim Slim Fit Premium', image: '/jeans/jean_mock_details/IMG_9980.JPG', price: 156000, preorders: 300 },
      { id: 'r2', name: 'Celana Jogger Street Style', image: '/jeans/jean_mock_details/IMG_9978.JPG', price: 170000, preorders: 400 },
      { id: 'r3', name: 'Celana Cargo Tactical', image: '/jeans/jean_mock_details/IMG_9977.JPG', price: 166000, preorders: 60 },
      { id: 'r4', name: 'Celana Palazzo Flare', image: '/jeans/jean_mock_details/IMG_9976.JPG', price: 139000, preorders: 200 },
    ],
    reviews: [
      {
        id: '1',
        author: 'b***o',
        rating: 5,
        date: '8 Okt 2025',
        verified: true,
        size: 'L',
        color: 'Beige',
        fit: 'True to Size' as const,
        height: '186 cm / 73 in',
        weight: '71 kg / 157 lbs',
        waist: '82 cm / 32 in',
        comment:
          'Kualitas produk: kualitas luar biasa sangat lembut di dalam celana olahraga paling nyaman yang pernah saya pakai',
        images: ['/jeans/jean_mock_reviews/reviews1.JPG', '/jeans/jean_mock_reviews/reviews2.JPG'],
        helpful: 16,
        purchaseDetails: 'Warna: Beige; Ukuran: L',
      },
      {
        id: '2',
        author: 's***7',
        rating: 5,
        date: '5 Okt 2025',
        verified: true,
        size: 'M',
        color: 'Hitam',
        fit: 'True to Size' as const,
        comment:
          'Produknya sangat bagus, bahannya lembut dan nyaman. Ukuran pas sesuai deskripsi. Sangat puas dengan pembelian.',
        helpful: 8,
        purchaseDetails: 'Warna: Hitam; Ukuran: M',
      },
      {
        id: '3',
        author: 'm***a',
        rating: 4,
        date: '2 Okt 2025',
        verified: true,
        size: 'XL',
        color: 'Abu-abu',
        fit: 'Large' as const,
        height: '175 cm / 69 in',
        weight: '85 kg / 187 lbs',
        comment:
          'Kualitas dan desain bagus. Celana olahraga nyaman untuk penggunaan sehari-hari. Sarankan pilih ukuran lebih kecil karena agak longgar.',
        images: ['/jeans/jean_mock_reviews/reviews3.JPG'],
        helpful: 12,
        purchaseDetails: 'Warna: Abu-abu; Ukuran: XL',
      },
    ],
    recommendations: [
      {
        id: '1',
        name: 'Celana Olahraga Pria Polos',
        image: 'https://images.unsplash.com/photo-1506629905607-d2e8b25cbca7?w=300&h=300&fit=crop',
        price: 75000,
        originalPrice: 105000,
        discount: 29,
        rating: 4.5,
        reviews: 432,
        badges: ['Diskon', 'Terlaris'],
      },
      {
        id: '2',
        name: 'Jogger Pria Kasual',
        image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=300&fit=crop',
        price: 85000,
        originalPrice: 120000,
        discount: 30,
        rating: 4.7,
        reviews: 289,
        badges: ['Diskon'],
      },
      {
        id: '3',
        name: 'Celana Track Pria',
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop',
        price: 95000,
        originalPrice: 135000,
        discount: 29,
        rating: 4.3,
        reviews: 156,
        badges: ['Terlaris'],
      },
    ],
    images: [

      {
        id: '1',
        url: '/jeans/jean_mock_details/IMG_9981.JPG',
        thumbnail: '/jeans/jean_mock_details/IMG_9981.JPG',
        alt: 'Celana jeans detail tampak samping',
      },
      {
        id: '2',
        url: '/jeans/jean_mock_details/IMG_9980.JPG',
        thumbnail: '/jeans/jean_mock_details/IMG_9980.JPG',
        alt: 'Celana jeans detail tampak belakang',
      },
      {
        id: '3',
        url: '/jeans/jean_mock_details/IMG_9978.JPG',
        thumbnail: '/jeans/jean_mock_details/IMG_9978.JPG',
        alt: 'Celana jeans detail close-up',
      },
      {
        id: '4',
        url: '/jeans/jean_mock_details/IMG_9977.JPG',
        thumbnail: '/jeans/jean_mock_details/IMG_9977.JPG',
        alt: 'Celana jeans detail material',
      },
      {
        id: '5',
        url: '/jeans/jean_mock_details/IMG_9976.JPG',
        thumbnail: '/jeans/jean_mock_details/IMG_9976.JPG',
        alt: 'Celana jeans detail stitching',
      },
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan | Laku',
    };
  }

  return {
    title: `${product.name} | Laku`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0].url],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.images[0].url],
    },
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // DON'T wrap in new layout - use existing app layout
  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileProductPage product={product} />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <DesktopProductPage product={product} />
      </div>
    </>
  );
}