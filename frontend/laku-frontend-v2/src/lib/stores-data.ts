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
    logoImage: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_produk.webp',
    
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
    logoImage: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk.webp',
    
    instagram: '@karakiri.id',
    website: 'https://karakiri.id',
    location: 'Bandung, Indonesia',
    
    followers: 89000,
    totalSold: 50000,
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
    logoImage: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk.webp',
    
    instagram: '@rue.indonesia',
    website: 'https://rue-fashion.com',
    location: 'Surabaya, Indonesia',
    
    followers: 67000,
    totalSold: 35000,
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
    logoImage: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk.webp',
    
    instagram: '@wearthreek',
    website: 'https://wearthreek.com',
    location: 'Jakarta, Indonesia',
    
    followers: 156000,
    totalSold: 85000,
    productsCount: 85,
    rating: 4.9,
    
    story: {
      about: 'WEAR THREEK lahir dari nostalgia era 2000-an yang penuh dengan fashion statements yang berani. Kami ingin membawa kembali energi dan style dari era tersebut dengan sentuhan modern.',
      mission: 'Memberdayakan generasi muda untuk berekspresi melalui fashion yang unik dan penuh karakter.',
      founded: '2021'
    },
    
    productSlugs: ['wearthreek'],
    
    categories: ['Denim', 'Streetwear', 'Y2K', 'Casual']
  },

  // ==================== NEW STORE BRANDS ====================

  'lululemon': {
    id: 'store-lululemon',
    slug: 'lululemon',
    name: 'Lululemon',
    tagline: 'Technical Athletic Wear for a Healthy Lifestyle',
    description: 'Lululemon adalah brand athletic wear premium dari Kanada yang menghadirkan apparel berkualitas tinggi untuk yoga, running, dan berbagai aktivitas lainnya. Setiap produk dirancang dengan teknologi terkini untuk kenyamanan dan performa maksimal.',
    coverImage: '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_produk.webp',
    logoImage: '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_produk.webp',

    instagram: '@lululemon',
    website: 'https://lululemon.co.id',
    location: 'Singapore',

    followers: 345000,
    totalSold: 125000,
    productsCount: 156,
    rating: 4.9,

    story: {
      about: 'Lululemon didirikan di Vancouver, Kanada pada 1998 dengan misi menciptakan komponen untuk runway yang lebih baik. Hari ini, kami menjadi pemimpin global dalam athletic apparel.',
      mission: 'Menginspirasi dan mendukung semua orang untuk hidup kehidupan yang aktif, sehat, dan bahagia.',
      founded: '1998'
    },

    productSlugs: ['lulu-softstreme-pant', 'lulu-swiftly-ls', 'lulu-combo'],

    categories: ['Athletic Wear', 'Yoga', 'Running', 'Training', 'Sets']
  },

  'prada': {
    id: 'store-prada',
    slug: 'prada',
    name: 'Prada',
    tagline: 'Luxury Fashion House Since 1913',
    description: 'Prada adalah rumah mode mewah Italia yang didirikan di Milan pada 1913. Dikenal dengan desain yang ikonik dan craftsmanship yang luar biasa, Prada menghadirkan koleksi leather goods, fashion, dan accessories premium.',
    coverImage: '/products/Prada - Black Medium Leather Tote Bag/prada_produk.webp',
    logoImage: '/products/Prada - Black Medium Leather Tote Bag/prada_produk.webp',

    instagram: '@prada',
    website: 'https://prada.com',
    location: 'Milan, Italy',

    followers: 2890000,
    totalSold: 45000,
    productsCount: 234,
    rating: 5.0,

    story: {
      about: 'Prada didirikan oleh Mario Prada sebagai toko kulit di Milan. Hari ini, Prada adalah salah satu rumah mode paling berpengaruh dan dihormati di dunia.',
      mission: 'Menciptakan luxury goods yang menggabungkan inovasi desain dengan craftsmanship Italia terbaik.',
      founded: '1913'
    },

    productSlugs: ['prada-tote-bag', 'prada-mm-stanley-combo'],

    categories: ['Bags', 'Shoes', 'Accessories', 'Ready-to-Wear', 'Sets']
  },

  'maisonmargiela': {
    id: 'store-mm',
    slug: 'maisonmargiela',
    name: 'Maison Margiela',
    tagline: 'Avant-Garde Fashion House',
    description: 'Maison Margiela adalah maison mode Prancis yang didirikan oleh Martin Margiela pada 1988. Dikenal dengan desain avant-garde dan inovasi tanpa kompromi, brand ini menjadi ikon dalam dunia fashion haute couture.',
    coverImage: '/products/Maison Margiela - Tabi Ballerina Flats/mm_produk.webp',
    logoImage: '/products/Maison Margiela - Tabi Ballerina Flats/mm_produk.webp',

    instagram: '@maisonmargiela',
    website: 'https://maisonmargiela.com',
    location: 'Paris, France',

    followers: 1250000,
    totalSold: 28000,
    productsCount: 178,
    rating: 4.9,

    story: {
      about: 'Maison Margiela lahir dari visi Martin Margiela untuk menantang konvensi fashion. Dengan tabi yang ikonik dan pendekatan anti-mainstream, brand ini mempengaruhi arah fashion global.',
      mission: 'Terus mendorong batas-batas fashion dengan desain yang provokatif dan craftsmanship yang sempurna.',
      founded: '1988'
    },

    productSlugs: ['mm-tabi-flats', 'prada-mm-stanley-combo'],

    categories: ['Shoes', 'Bags', 'Ready-to-Wear', 'Accessories', 'Sets']
  },

  'stanley': {
    id: 'store-stanley',
    slug: 'stanley',
    name: 'Stanley 1913',
    tagline: 'Built for Life Since 1913',
    description: 'Stanley adalah brand legendaris Amerika yang didirikan pada 1913. Dikenal dengan produk berkapasitas tinggi yang tahan lama, Stanley menghadirkan tumbler, cooler, dan aksesoris dengan kualitas premium.',
    coverImage: '/products/Stanley - Jennie Quencher Luxe/stanley_produk.webp',
    logoImage: '/products/Stanley - Jennie Quencher Luxe/stanley_produk.webp',

    instagram: '@stanley1913',
    website: 'https://stanley1913.com',
    location: 'Seattle, USA',

    followers: 890000,
    totalSold: 320000,
    productsCount: 89,
    rating: 4.8,

    story: {
      about: 'Stanley memulai perjalanan dengan membuat termos untuk pekerja konstruksi dan militer. Hari ini, Stanley menjadi brand pilihan untuk outdoor enthusiasts dan gaya hidup aktif.',
      mission: 'Menghadirkan produk yang tangguh, fungsional, dan berkelanjutan untuk generasi mendatang.',
      founded: '1913'
    },

    productSlugs: ['stanley-quencher', 'prada-mm-stanley-combo'],

    categories: ['Tumblers', 'Coolers', 'Drinkware', 'Outdoor', 'Sets']
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
