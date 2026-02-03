import type { StoreData } from '@/types/store';

// Store data for the 4 brand stores
export const storesData: Record<string, StoreData> = {
  'cult-suri': {
    id: 'store-cult-suri',
    slug: 'cult-suri',
    name: 'CULT SURI',
    tagline: 'Elegant Fashion for Modern Women',
    description: 'CULT SURI menghadirkan koleksi fashion elegan dengan sentuhan modern untuk wanita Indonesia. Setiap piece dirancang dengan detail yang indah dan material premium.',
    coverImage: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_produk.webp',
    logoImage: '/stores/cult-suri-logo.png',
    
    instagram: '@cultsuri',
    website: 'https://cultsuri.com',
    location: 'Jakarta, Indonesia',
    
    followers: 125000,
    totalSold: 71400,
    productsCount: 48,
    rating: 4.8,
    
    story: {
      about: 'CULT SURI adalah brand fashion lokal yang fokus pada desain elegan dan feminine. Kami percaya setiap wanita berhak tampil percaya diri dengan pakaian yang nyaman dan stylish.',
      mission: 'Menciptakan fashion yang timeless, elegan, dan dapat dipakai dalam berbagai kesempatan.',
      founded: '2019'
    },
    
    productSlugs: ['cult-suri'],
    
    categories: ['Tops', 'Dresses', 'Outerwear', 'Accessories']
  },

  'karakiri': {
    id: 'store-karakiri',
    slug: 'karakiri',
    name: 'Karakiri',
    tagline: 'Contemporary Indonesian Fashion',
    description: 'Karakiri adalah brand fashion Indonesia yang mengusung konsep contemporary dengan sentuhan lokal. Kami menghadirkan pieces yang versatile dan mudah dipadukan.',
    coverImage: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk.webp',
    logoImage: '/stores/karakiri-logo.png',
    
    instagram: '@karakiri.id',
    website: 'https://karakiri.id',
    location: 'Bandung, Indonesia',
    
    followers: 89000,
    productsCount: 62,
    rating: 4.9,
    
    story: {
      about: 'Karakiri lahir dari kecintaan terhadap fashion Indonesia yang berkualitas. Kami ingin membuktikan bahwa produk lokal bisa bersaing dengan brand internasional.',
      mission: 'Menghadirkan fashion berkualitas tinggi dengan harga yang terjangkau untuk semua kalangan.',
      founded: '2018'
    },
    
    productSlugs: ['karakiri'],
    
    categories: ['Bottoms', 'Pants', 'Skirts', 'Coordinates']
  },

  'rue': {
    id: 'store-rue',
    slug: 'rue',
    name: 'RUE',
    tagline: 'Feminine & Sophisticated Style',
    description: 'RUE menghadirkan koleksi fashion feminine dengan desain yang sophisticated. Setiap piece dirancang untuk wanita yang ingin tampil anggun dalam setiap kesempatan.',
    coverImage: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk.webp',
    logoImage: '/stores/rue-logo.png',
    
    instagram: '@rue.indonesia',
    website: 'https://rue-fashion.com',
    location: 'Surabaya, Indonesia',
    
    followers: 67000,
    productsCount: 35,
    rating: 4.7,
    
    story: {
      about: 'RUE adalah brand yang terinspirasi dari keanggunan wanita modern. Kami percaya bahwa kesederhanaan adalah bentuk kemewahan yang sesungguhnya.',
      mission: 'Menciptakan pakaian yang membuat wanita merasa cantik dan percaya diri.',
      founded: '2020'
    },
    
    productSlugs: ['rue'],
    
    categories: ['Tops', 'Blouses', 'Knitwear', 'Basics']
  },

  'wearthreek': {
    id: 'store-wearthreek',
    slug: 'wearthreek',
    name: 'WEAR THREEK',
    tagline: 'Y2K Fashion & Streetwear',
    description: 'WEAR THREEK adalah brand streetwear yang terinspirasi dari era Y2K. Kami menghadirkan fashion yang bold, trendy, dan expressive untuk generasi muda Indonesia.',
    coverImage: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk.webp',
    logoImage: '/stores/wearthreek-logo.png',
    
    instagram: '@wearthreek',
    website: 'https://wearthreek.com',
    location: 'Jakarta, Indonesia',
    
    followers: 156000,
    productsCount: 85,
    rating: 4.9,
    
    story: {
      about: 'WEAR THREEK lahir dari nostalgia era 2000-an yang penuh dengan fashion statements yang berani. Kami ingin membawa kembali energi dan style dari era tersebut dengan sentuhan modern.',
      mission: 'Memberdayakan generasi muda untuk berekspresi melalui fashion yang unik dan penuh karakter.',
      founded: '2021'
    },
    
    productSlugs: ['wearthreek'],
    
    categories: ['Denim', 'Streetwear', 'Y2K', 'Casual']
  }
};

// Helper functions
export function getStoreBySlug(slug: string): StoreData | undefined {
  return storesData[slug];
}

export function getAllStoreSlugs(): string[] {
  return Object.keys(storesData);
}

export function getStoreProducts(store: StoreData) {
  // Import products-data to get product information
  const { productsData } = require('./products-data');
  return store.productSlugs
    .map(slug => productsData[slug])
    .filter(Boolean);
}
