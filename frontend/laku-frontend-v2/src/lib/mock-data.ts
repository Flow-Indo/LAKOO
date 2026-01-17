import { Product } from '@/types';

// Simulate pagination for infinite scroll
export async function fetchMoreProducts(offset: number, limit: number): Promise<Product[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Generate additional products for infinite scroll demo
  const additionalProducts: Product[] = [];
  const startId = MOCK_PRODUCTS.length + offset + 1;

  for (let i = 0; i < limit; i++) {
    const id = (startId + i).toString();
    const productIndex = i % MOCK_PRODUCTS.length;
    const baseProduct = MOCK_PRODUCTS[productIndex];

    // Create deterministic variations based on id
    const variation = parseInt(id) % 10;

    additionalProducts.push({
      ...baseProduct,
      id,
      name: `${baseProduct.name} (${id})`,
      slug: `${baseProduct.slug}-${id}`,
      sold: (baseProduct.sold || 0) + variation * 10,
      price: baseProduct.price + variation * 5000,
    });
  }

  return additionalProducts;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Batik Tulis Jogja Premium',
    slug: 'batik-tulis-jogja-premium',
    price: 450000,
    originalPrice: 600000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800',
    ],
    category: 'Fashion',
    description: 'Batik tulis asli Jogja dengan motif klasik. Dibuat dengan pewarna alami dan dikerjakan oleh pengrajin berpengalaman.',
    stock: 15,
    rating: 4.8,
    reviewCount: 124,
    sold: 89,
    store: {
      id: 'store1',
      name: 'Toko Batik Nusantara',
      location: 'Yogyakarta',
    },
  },
  {
    id: '2',
    name: 'Kopi Arabica Gayo Premium 500g',
    slug: 'kopi-arabica-gayo-premium',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    category: 'Makanan & Minuman',
    description: 'Kopi Arabica dari dataran tinggi Gayo, Aceh. Citarasa khas dengan aroma yang kuat.',
    stock: 50,
    rating: 4.9,
    reviewCount: 234,
    sold: 456,
    store: {
      id: 'store2',
      name: 'Kopi Gayo Official',
      location: 'Aceh',
    },
  },
  {
    id: '3',
    name: 'Tenun Ikat Sumba Tradisional',
    slug: 'tenun-ikat-sumba-tradisional',
    price: 750000,
    originalPrice: 950000,
    discount: 21,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Fashion',
    description: 'Tenun ikat asli Sumba dengan motif tradisional. Cocok untuk acara formal atau koleksi pribadi.',
    stock: 8,
    rating: 4.7,
    reviewCount: 67,
    sold: 23,
    store: {
      id: 'store3',
      name: 'Tenun Sumba Heritage',
      location: 'NTT',
    },
  },
  {
    id: '4',
    name: 'Madu Hutan Kalimantan 1kg',
    slug: 'madu-hutan-kalimantan',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500',
    category: 'Makanan & Minuman',
    description: 'Madu hutan asli dari hutan Kalimantan. Dipanen secara tradisional tanpa bahan kimia.',
    stock: 25,
    rating: 4.6,
    reviewCount: 145,
    sold: 312,
    store: {
      id: 'store4',
      name: 'Madu Hutan Borneo',
      location: 'Kalimantan',
    },
  },
  {
    id: '5',
    name: 'Kerajinan Perak Khas Yogyakarta',
    slug: 'kerajinan-perak-khas-yogyakarta',
    price: 350000,
    originalPrice: 420000,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500',
    category: 'Fashion',
    description: 'Kerajinan perak tangan dengan motif Jawa klasik. Bisa untuk gelang, kalung, atau aksesoris lainnya.',
    stock: 12,
    rating: 4.8,
    reviewCount: 89,
    sold: 156,
    store: {
      id: 'store5',
      name: 'Perak Jogja',
      location: 'Yogyakarta',
    },
  },
  {
    id: '6',
    name: 'Gula Semut Merah Premium 250g',
    slug: 'gula-semut-merah-premium',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=500',
    category: 'Makanan & Minuman',
    description: 'Gula semut merah organik dari petani lokal. Kaya akan nutrisi dan cocok untuk kesehatan.',
    stock: 40,
    rating: 4.5,
    reviewCount: 98,
    sold: 267,
    store: {
      id: 'store6',
      name: 'Gula Semut Nusantara',
      location: 'Jawa Tengah',
    },
  },
  {
    id: '7',
    name: 'Batik Cap Modern Motif Abstrak',
    slug: 'batik-cap-modern-motif-abstrak',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=500',
    category: 'Fashion',
    description: 'Batik cap dengan motif modern dan abstrak. Nyaman dipakai untuk acara casual maupun semi formal.',
    stock: 30,
    rating: 4.4,
    reviewCount: 156,
    sold: 89,
    store: {
      id: 'store1',
      name: 'Toko Batik Nusantara',
      location: 'Yogyakarta',
    },
  },
  {
    id: '8',
    name: 'Kopi Luwak Special Reserve 200g',
    slug: 'kopi-luwak-special-reserve',
    price: 450000,
    originalPrice: 550000,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500',
    category: 'Makanan & Minuman',
    description: 'Kopi luwak premium dengan proses fermentasi alami. Citarasa unik dan langka.',
    stock: 5,
    rating: 4.9,
    reviewCount: 45,
    sold: 78,
    store: {
      id: 'store7',
      name: 'Kopi Luwak Indonesia',
      location: 'Bali',
    },
  }
];

export const CATEGORIES = [
  { id: '1', name: 'Fashion', slug: 'fashion', icon: '👔' },
  { id: '2', name: 'Makanan & Minuman', slug: 'food-beverage', icon: '🍽️' },
  { id: '3', name: 'Elektronik', slug: 'electronics', icon: '📱' },
  { id: '4', name: 'Kecantikan', slug: 'beauty', icon: '💄' },
  { id: '5', name: 'Rumah Tangga', slug: 'home', icon: '🏠' },
];