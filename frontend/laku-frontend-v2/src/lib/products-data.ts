// Product data for post and product pages
// All 4 products with post (eksplor) images and product (produk) images

export interface ProductTag {
  productSlug: string;
  position: {
    x: number; // percentage from left (0-100)
    y: number; // percentage from top (0-100)
  };
  imageIndex: number; // which image in carousel (0-3)
}

export interface ProductVariant {
  id: string;
  name: string;
  image: string;
  stock: number;
  label?: string;
}

export interface ProductSize {
  id: string;
  name: string;
  price: number;
  weight?: number; // weight in kg for shipping calculation
  weightRecommendation?: string; // weight recommendation like "45-57 kg"
  measurements: {
    waist?: string;
    hip?: string;
    length?: string;
    inseam?: string;
    bust?: string;
    sleeve?: string;
    width?: string;
    height?: string;
    depth?: string;
    handle?: string;
    volume?: string;
  };
}

export interface ShippingOption {
  id: string;
  name: string;
  courier: string;
  service: string;
  price: number;
  estimatedDays: string;
  isFree: boolean;
  isFast: boolean;
}

export interface StoreVoucher {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minPurchase: number;
  maxDiscount: number;
  validUntil: string;
  description: string;
}

export interface ProductData {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;

  // For Post Page (eksplor images)
  postImages: string[];

  // For Product Page (produk images)
  productImages: string[];

  // Color variants for checkout modal
  colors: ProductVariant[];

  // Size variants with measurements for checkout modal
  sizes: ProductSize[];

  // Shipping options
  shippingOptions: ShippingOption[];

  // Store vouchers
  vouchers: StoreVoucher[];

  // Post-specific data
  postData: {
    title: string;
    content: string;
    tags: string[];
    author: {
      name: string;
      avatar: string;
      followerCount: number;
    };
    location: string;
    editedAt: string;
    interactions: {
      likes: number;
      favorites: number;
      comments: number;
    };
  };

  // Product-specific data - matching DesktopProductPage structure
  productData: {
    rating: number;
    reviewCount: number;
    sold: string;
    sizes: string[];
    colors: string[];
    category: string;
    categorySlug: string;
    subcategory?: string;
    subcategorySlug?: string;
    subtitle?: string;
    sku: string;
    stock: number;
    discountPercentage: number;
    badges?: string[];
  };

  // Tagged products in post images (Dewu style)
  taggedProducts?: {
    tags: ProductTag[];
  };
}

export const productsData: Record<string, ProductData> = {
  'cult-suri': {
    id: 'prod-cult-suri',
    slug: 'cult-suri',
    name: 'Coco Top Chiffon Dengan Scarf Detail',
    brand: 'CULT SURI',
    description: 'Atasan chiffon elegan dengan detail scarf yang cantik. Sempurna untuk acara formal maupun kasual.',
    price: 289000,
    originalPrice: 450000,
    currency: 'Rp',

    postImages: [
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor1.webp',
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor2.webp',
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor3.webp',
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor4.webp'
    ],

    productImages: [
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_produk.webp',
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor1.webp',
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor2.webp',
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor3.webp',
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor4.webp'
    ],

    // Color variants with REAL product images for checkout modal
    // Note: CULT SURI has only 1 product image, so 1 color variant
    colors: [
      {
        id: 'coco-beige',
        name: 'Beige',
        label: '米色',
        image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_produk.webp',
        stock: 25
      }
    ],

    // Size variants with measurements for checkout modal
    sizes: [
      {
        id: 's',
        name: 'S',
        price: 289000,
        weight: 0.2,
        weightRecommendation: '45-50 kg',
        measurements: {
          bust: '88cm',
          waist: '68cm',
          length: '62cm'
        }
      },
      {
        id: 'm',
        name: 'M',
        price: 289000,
        weight: 0.22,
        weightRecommendation: '50-55 kg',
        measurements: {
          bust: '92cm',
          waist: '72cm',
          length: '64cm'
        }
      },
      {
        id: 'l',
        name: 'L',
        price: 289000,
        weight: 0.25,
        weightRecommendation: '55-60 kg',
        measurements: {
          bust: '96cm',
          waist: '76cm',
          length: '66cm'
        }
      },
      {
        id: 'xl',
        name: 'XL',
        price: 289000,
        weight: 0.28,
        weightRecommendation: '60-65 kg',
        measurements: {
          bust: '100cm',
          waist: '80cm',
          length: '68cm'
        }
      }
    ],

    // Shipping options
    shippingOptions: [
      {
        id: 'jne-yes',
        name: 'JNE Yes',
        courier: 'JNE',
        service: 'YES',
        price: 25000,
        estimatedDays: '1 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'jne-reg',
        name: 'JNE Reguler',
        courier: 'JNE',
        service: 'Reguler',
        price: 12000,
        estimatedDays: '3-5 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'sicepat-best',
        name: 'SiCepat BEST',
        courier: 'SiCepat',
        service: 'BEST',
        price: 22000,
        estimatedDays: '2 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'sicepat-reg',
        name: 'SiCepat Reguler',
        courier: 'SiCepat',
        service: 'Reguler',
        price: 10000,
        estimatedDays: '4-6 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'jnt-super',
        name: 'J&T Super',
        courier: 'J&T',
        service: 'Super',
        price: 18000,
        estimatedDays: '2-3 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'gosend-same',
        name: 'GoSend Same Day',
        courier: 'GoSend',
        service: 'Same Day',
        price: 35000,
        estimatedDays: 'Hari Ini',
        isFree: false,
        isFast: true
      }
    ],

    // Store vouchers
    vouchers: [
      {
        id: 'cult-surprise',
        code: 'SURPRISE15',
        discount: 15,
        discountType: 'percentage',
        minPurchase: 200000,
        maxDiscount: 50000,
        validUntil: '2026-02-15',
        description: 'Diskon 15% s.d. Rp 50rb'
      },
      {
        id: 'cult-newuser',
        code: 'BARU15',
        discount: 15000,
        discountType: 'fixed',
        minPurchase: 100000,
        maxDiscount: 15000,
        validUntil: '2026-02-28',
        description: 'Potongan Rp 15rb'
      }
    ],

    postData: {
      title: 'Atasan Chiffon Elegan untuk Acara Spesial ✨',
      content: `Baru dapat atasan baru dari CULT SURI dan langsung jatuh cinta! Material chiffonnya lembut banget dan detail scarfnya bikin tampilan jadi lebih elegan.
      Cocok banget buat ke acara formal atau dinner date. Bahannya adem dan nyaman dipake seharian.`,
      tags: ['#FashionIndonesia', '#ChiffonTop', '#CULTSURI', '#OOTD', '#ElegantStyle'],
      author: {
        name: 'Fashion Diary',
        avatar: '',
        followerCount: 45200
      },
      location: 'Jakarta',
      editedAt: '2 jam yang lalu',
      interactions: {
        likes: 2847,
        favorites: 1203,
        comments: 156
      }
    },

    productData: {
      rating: 4.8,
      reviewCount: 342,
      sold: '71.4K+',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Beige', 'Black', 'White', 'Navy'],
      category: 'Tops',
      categorySlug: 'tops',
      subcategory: 'Blouse',
      subcategorySlug: 'blouse',
      subtitle: 'Atasan Chiffon Elegan dengan Scarf Detail',
      sku: 'CULT-COCO-001',
      stock: 50,
      discountPercentage: 36,
      badges: ['Diskon', 'Terlaris']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'cult-suri',
          position: { x: 55, y: 35 },
          imageIndex: 0
        }
      ]
    }
  },

  'karakiri': {
    id: 'prod-karakiri',
    slug: 'karakiri',
    name: 'Jolie Pants | Wide Leg Trousers | Culotte Pants',
    brand: 'Karakiri',
    description: 'Celana kulot wide leg yang nyaman dan stylish. Cocok untuk berbagai acara dan mudah dipadukan.',
    price: 325000,
    originalPrice: 499000,
    currency: 'Rp',

    postImages: [
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor1.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor2.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor3.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor4.webp'
    ],

    productImages: [
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk2.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk3.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk4.webp'
    ],

    // Color variants with REAL product images for checkout modal
    colors: [
      {
        id: 'jolie-black',
        name: 'Black',
        label: 'Black',
        image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk.webp',
        stock: 30
      },
      {
        id: 'jolie-cream',
        name: 'Cream',
        label: 'Cream',
        image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk2.webp',
        stock: 25
      },
      {
        id: 'jolie-brown',
        name: 'Brown',
        label: 'Brown',
        image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk3.webp',
        stock: 20
      },
      {
        id: 'jolie-olive',
        name: 'Olive',
        label: 'Olive',
        image: '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk4.webp',
        stock: 18
      }
    ],

    // Size variants with measurements for checkout modal
    sizes: [
      {
        id: 's',
        name: 'S',
        price: 325000,
        weight: 0.35,
        weightRecommendation: '45-52 kg',
        measurements: {
          waist: '68cm',
          hip: '92cm',
          length: '95cm'
        }
      },
      {
        id: 'm',
        name: 'M',
        price: 325000,
        weight: 0.38,
        weightRecommendation: '52-58 kg',
        measurements: {
          waist: '72cm',
          hip: '96cm',
          length: '97cm'
        }
      },
      {
        id: 'l',
        name: 'L',
        price: 325000,
        weight: 0.42,
        weightRecommendation: '58-65 kg',
        measurements: {
          waist: '76cm',
          hip: '100cm',
          length: '99cm'
        }
      },
      {
        id: 'xl',
        name: 'XL',
        price: 325000,
        weight: 0.45,
        weightRecommendation: '65-72 kg',
        measurements: {
          waist: '80cm',
          hip: '104cm',
          length: '101cm'
        }
      },
      {
        id: '2xl',
        name: '2XL',
        price: 325000,
        weight: 0.48,
        weightRecommendation: '72-80 kg',
        measurements: {
          waist: '84cm',
          hip: '108cm',
          length: '103cm'
        }
      }
    ],

    // Shipping options
    shippingOptions: [
      {
        id: 'jne-yes',
        name: 'JNE Yes',
        courier: 'JNE',
        service: 'YES',
        price: 28000,
        estimatedDays: '1 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'jne-reg',
        name: 'JNE Reguler',
        courier: 'JNE',
        service: 'Reguler',
        price: 15000,
        estimatedDays: '3-5 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'sicepat-best',
        name: 'SiCepat BEST',
        courier: 'SiCepat',
        service: 'BEST',
        price: 25000,
        estimatedDays: '2 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'sicepat-reg',
        name: 'SiCepat Reguler',
        courier: 'SiCepat',
        service: 'Reguler',
        price: 12000,
        estimatedDays: '4-6 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'jnt-super',
        name: 'J&T Super',
        courier: 'J&T',
        service: 'Super',
        price: 20000,
        estimatedDays: '2-3 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'gosend-same',
        name: 'GoSend Same Day',
        courier: 'GoSend',
        service: 'Same Day',
        price: 38000,
        estimatedDays: 'Hari Ini',
        isFree: false,
        isFast: true
      }
    ],

    // Store vouchers
    vouchers: [
      {
        id: 'kara-newyear',
        code: 'NEWYEAR25',
        discount: 25,
        discountType: 'percentage',
        minPurchase: 300000,
        maxDiscount: 75000,
        validUntil: '2026-02-14',
        description: 'Diskon 25% s.d. Rp 75rb'
      },
      {
        id: 'kara-freeship',
        code: 'GRATISONGKIR',
        discount: 0,
        discountType: 'fixed',
        minPurchase: 0,
        maxDiscount: 20000,
        validUntil: '2026-02-20',
        description: 'Gratis Ongkir s.d. Rp 20rb'
      }
    ],

    postData: {
      title: 'Wide Leg Pants yang Super Nyaman! 👖',
      content: `Jatuh cinta sama Jolie Pants dari Karakiri! Modelnya wide leg gitu jadi keliatan tinggi dan langsing.
      Bahannya juga adem dan nyaman banget dipake seharian. Bisa dipake ke kantor atau jalan-jalan. Versatile banget deh!`,
      tags: ['#Karakiri', '#WideLegPants', '#CulottePants', '#FashionMuslim', '#OOTD'],
      author: {
        name: 'Style Maven',
        avatar: '',
        followerCount: 67800
      },
      location: 'Bandung',
      editedAt: '5 jam yang lalu',
      interactions: {
        likes: 4192,
        favorites: 1876,
        comments: 234
      }
    },

    productData: {
      rating: 4.9,
      reviewCount: 567,
      sold: '5K+',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Black', 'Cream', 'Brown', 'Olive'],
      category: 'Bottoms',
      categorySlug: 'bottoms',
      subcategory: 'Culottes',
      subcategorySlug: 'culottes',
      subtitle: 'Celana Kulot Wide Leg Trendy',
      sku: 'KAR-JOLIE-001',
      stock: 75,
      discountPercentage: 35,
      badges: ['Diskon', 'Terlaris']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'karakiri',
          position: { x: 50, y: 60 },
          imageIndex: 0
        }
      ]
    }
  },

  'rue': {
    id: 'prod-rue',
    slug: 'rue',
    name: 'Sheer Top Atasan Lengan Panjang Boatneck Longsleeve',
    brand: 'RUE',
    description: 'Atasan sheer dengan boatneck yang feminine dan elegan. Material ringan dan breathable.',
    price: 195000,
    originalPrice: 320000,
    currency: 'Rp',

    postImages: [
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor1.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor2.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor3.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor4.webp'
    ],

    productImages: [
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk2.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk3.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk4.webp'
    ],

    // Color variants with REAL product images for checkout modal
    colors: [
      {
        id: 'sheer-black',
        name: 'Black',
        label: '黑色',
        image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk.webp',
        stock: 35
      },
      {
        id: 'sheer-white',
        name: 'White',
        label: '白色',
        image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk2.webp',
        stock: 30
      },
      {
        id: 'sheer-grey',
        name: 'Grey',
        label: '灰色',
        image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk3.webp',
        stock: 25
      },
      {
        id: 'sheer-beige',
        name: 'Beige',
        label: '米色',
        image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk4.webp',
        stock: 28
      }
    ],

    // Size variants with measurements for checkout modal
    sizes: [
      {
        id: 's',
        name: 'S',
        price: 195000,
        weight: 0.25,
        weightRecommendation: '40-48 kg',
        measurements: {
          bust: '84cm',
          waist: '64cm',
          length: '58cm',
          sleeve: '58cm'
        }
      },
      {
        id: 'm',
        name: 'M',
        price: 195000,
        weight: 0.28,
        weightRecommendation: '48-55 kg',
        measurements: {
          bust: '88cm',
          waist: '68cm',
          length: '60cm',
          sleeve: '60cm'
        }
      },
      {
        id: 'l',
        name: 'L',
        price: 195000,
        weight: 0.32,
        weightRecommendation: '55-62 kg',
        measurements: {
          bust: '92cm',
          waist: '72cm',
          length: '62cm',
          sleeve: '62cm'
        }
      },
      {
        id: 'xl',
        name: 'XL',
        price: 195000,
        weight: 0.35,
        weightRecommendation: '62-70 kg',
        measurements: {
          bust: '96cm',
          waist: '76cm',
          length: '64cm',
          sleeve: '64cm'
        }
      }
    ],

    // Shipping options
    shippingOptions: [
      {
        id: 'jne-yes',
        name: 'JNE Yes',
        courier: 'JNE',
        service: 'YES',
        price: 24000,
        estimatedDays: '1 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'jne-reg',
        name: 'JNE Reguler',
        courier: 'JNE',
        service: 'Reguler',
        price: 11000,
        estimatedDays: '3-5 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'sicepat-best',
        name: 'SiCepat BEST',
        courier: 'SiCepat',
        service: 'BEST',
        price: 21000,
        estimatedDays: '2 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'sicepat-reg',
        name: 'SiCepat Reguler',
        courier: 'SiCepat',
        service: 'Reguler',
        price: 9000,
        estimatedDays: '4-6 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'jnt-super',
        name: 'J&T Super',
        courier: 'J&T',
        service: 'Super',
        price: 17000,
        estimatedDays: '2-3 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'gosend-same',
        name: 'GoSend Same Day',
        courier: 'GoSend',
        service: 'Same Day',
        price: 32000,
        estimatedDays: 'Hari Ini',
        isFree: false,
        isFast: true
      }
    ],

    // Store vouchers
    vouchers: [
      {
        id: 'rue-firstbuy',
        code: 'FIRST10',
        discount: 10,
        discountType: 'percentage',
        minPurchase: 150000,
        maxDiscount: 30000,
        validUntil: '2026-02-28',
        description: 'Diskon 10% s.d. Rp 30rb'
      },
      {
        id: 'rue-loyalty',
        code: 'HEMAT20K',
        discount: 20000,
        discountType: 'fixed',
        minPurchase: 200000,
        maxDiscount: 20000,
        validUntil: '2026-03-15',
        description: 'Potongan Rp 20rb'
      }
    ],

    postData: {
      title: 'Sheer Top yang Bikin Penampilan Makin Feminine 🌸',
      content: `Suka banget sama sheer top dari RUE ini! Modelnya boatneck jadi keliatan lebih anggun.
      Material sheernya tipis tapi gak nerawang, jadi tetep sopan. Bisa dipake buat layering atau pakai sendiri dengan inner. Love it!`,
      tags: ['#RUEFashion', '#SheerTop', '#Boatneck', '#FeminineStyle', '#FashionIndo'],
      author: {
        name: 'Bella Fashion',
        avatar: '',
        followerCount: 34500
      },
      location: 'Surabaya',
      editedAt: '1 hari yang lalu',
      interactions: {
        likes: 1923,
        favorites: 845,
        comments: 98
      }
    },

    productData: {
      rating: 4.7,
      reviewCount: 289,
      sold: '1.8K+',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Grey', 'Beige'],
      category: 'Tops',
      categorySlug: 'tops',
      subcategory: 'Long Sleeve',
      subcategorySlug: 'long-sleeve',
      subtitle: 'Atasan Sheer Boatneck Feminin',
      sku: 'RUE-SHEER-001',
      stock: 60,
      discountPercentage: 39,
      badges: ['Diskon']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'rue',
          position: { x: 50, y: 40 },
          imageIndex: 0
        }
      ]
    }
  },

  'wearthreek': {
    id: 'prod-wearthreek',
    slug: 'wearthreek',
    name: 'Britney Low Waist Jeans',
    brand: 'WEAR THREEK',
    description: 'Jeans low waist dengan model Y2K yang trendy. Stretchable dan comfortable untuk daily wear.',
    price: 399000,
    originalPrice: 650000,
    currency: 'Rp',

    postImages: [
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_eksplor1.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_eksplor2.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_eksplor3.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_eksplor4.webp'
    ],

    productImages: [
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk2.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk3.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk4.webp'
    ],

    // Color variants with REAL product images for checkout modal
    colors: [
      {
        id: 'britney-light-blue',
        name: 'Light Blue',
        label: '浅蓝色',
        image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk.webp',
        stock: 40
      },
      {
        id: 'britney-dark-blue',
        name: 'Dark Blue',
        label: '深蓝色',
        image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk2.webp',
        stock: 35
      },
      {
        id: 'britney-black',
        name: 'Black',
        label: '黑色',
        image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk3.webp',
        stock: 30
      },
      {
        id: 'britney-grey',
        name: 'Grey',
        label: '灰色',
        image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk4.webp',
        stock: 25
      }
    ],

    // Size variants with measurements for checkout modal
    sizes: [
      {
        id: '24',
        name: '24',
        price: 399000,
        weight: 0.45,
        weightRecommendation: '40-47 kg',
        measurements: {
          waist: '64cm',
          hip: '88cm',
          inseam: '78cm',
          length: '98cm'
        }
      },
      {
        id: '25',
        name: '25',
        price: 399000,
        weight: 0.48,
        weightRecommendation: '47-52 kg',
        measurements: {
          waist: '66cm',
          hip: '90cm',
          inseam: '78cm',
          length: '99cm'
        }
      },
      {
        id: '26',
        name: '26',
        price: 399000,
        weight: 0.50,
        weightRecommendation: '52-57 kg',
        measurements: {
          waist: '68cm',
          hip: '92cm',
          inseam: '79cm',
          length: '100cm'
        }
      },
      {
        id: '27',
        name: '27',
        price: 399000,
        weight: 0.52,
        weightRecommendation: '57-62 kg',
        measurements: {
          waist: '70cm',
          hip: '94cm',
          inseam: '79cm',
          length: '101cm'
        }
      },
      {
        id: '28',
        name: '28',
        price: 399000,
        weight: 0.55,
        weightRecommendation: '62-67 kg',
        measurements: {
          waist: '72cm',
          hip: '96cm',
          inseam: '80cm',
          length: '102cm'
        }
      },
      {
        id: '29',
        name: '29',
        price: 399000,
        weight: 0.58,
        weightRecommendation: '67-72 kg',
        measurements: {
          waist: '74cm',
          hip: '98cm',
          inseam: '80cm',
          length: '103cm'
        }
      },
      {
        id: '30',
        name: '30',
        price: 399000,
        weight: 0.60,
        weightRecommendation: '72-77 kg',
        measurements: {
          waist: '76cm',
          hip: '100cm',
          inseam: '81cm',
          length: '104cm'
        }
      }
    ],

    // Shipping options
    shippingOptions: [
      {
        id: 'jne-yes',
        name: 'JNE Yes',
        courier: 'JNE',
        service: 'YES',
        price: 30000,
        estimatedDays: '1 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'jne-reg',
        name: 'JNE Reguler',
        courier: 'JNE',
        service: 'Reguler',
        price: 18000,
        estimatedDays: '3-5 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'sicepat-best',
        name: 'SiCepat BEST',
        courier: 'SiCepat',
        service: 'BEST',
        price: 28000,
        estimatedDays: '2 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'sicepat-reg',
        name: 'SiCepat Reguler',
        courier: 'SiCepat',
        service: 'Reguler',
        price: 14000,
        estimatedDays: '4-6 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'jnt-super',
        name: 'J&T Super',
        courier: 'J&T',
        service: 'Super',
        price: 22000,
        estimatedDays: '2-3 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'gosend-same',
        name: 'GoSend Same Day',
        courier: 'GoSend',
        service: 'Same Day',
        price: 45000,
        estimatedDays: 'Hari Ini',
        isFree: false,
        isFast: true
      }
    ],

    // Store vouchers
    vouchers: [
      {
        id: 'wt-britney',
        code: 'BRITNEY20',
        discount: 20,
        discountType: 'percentage',
        minPurchase: 350000,
        maxDiscount: 80000,
        validUntil: '2026-02-14',
        description: 'Diskon 20% s.d. Rp 80rb'
      },
      {
        id: 'wt-vip',
        code: 'VIP30K',
        discount: 30000,
        discountType: 'fixed',
        minPurchase: 400000,
        maxDiscount: 30000,
        validUntil: '2026-03-01',
        description: 'Potongan Rp 30rb'
      },
      {
        id: 'wt-freeship',
        code: 'ONGKIR0',
        discount: 0,
        discountType: 'fixed',
        minPurchase: 250000,
        maxDiscount: 25000,
        validUntil: '2026-02-28',
        description: 'Gratis Ongkir s.d. Rp 25rb'
      }
    ],

    postData: {
      title: 'Jeans Low Waist yang Lagi Hits Banget! 🔥',
      content: `OMG finally nemu jeans low waist yang pas banget! Britney Jeans dari WEAR THREEK ini model Y2K vibes gitu.
      Stretchnya pas, gak terlalu ketat tapi tetep shaping body dengan baik. Materialnya juga bagus dan nyaman dipake seharian!`,
      tags: ['#WEARTHREEK', '#LowWaistJeans', '#Y2KFashion', '#DenimLovers', '#JeansOOTD'],
      author: {
        name: 'Denim Queen',
        avatar: '',
        followerCount: 89200
      },
      location: 'Jakarta',
      editedAt: '3 jam yang lalu',
      interactions: {
        likes: 5632,
        favorites: 2341,
        comments: 412
      }
    },

    productData: {
      rating: 4.9,
      reviewCount: 823,
      sold: '8K+',
      sizes: ['24', '25', '26', '27', '28', '29', '30'],
      colors: ['Light Blue', 'Dark Blue', 'Black', 'Grey'],
      category: 'Denim',
      categorySlug: 'denim',
      subcategory: 'Low Waist Jeans',
      subcategorySlug: 'low-waist-jeans',
      subtitle: 'Jeans Y2K Low Waist Trendy',
      sku: 'WT-BRITNEY-001',
      stock: 100,
      discountPercentage: 39,
      badges: ['Diskon', 'Terlaris', 'Hot']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'wearthreek',
          position: { x: 45, y: 65 },
          imageIndex: 0
        }
      ]
    }
  },

  // ==================== NEW PRODUCTS ====================

  // Standalone products for MARKET PAGE ONLY (not in explore feed)
  // These are accessible when clicking tagged products in combo posts

  'lulu-softstreme-pant': {
    id: 'prod-lulu-softstreme-pant',
    slug: 'lulu-softstreme-pant',
    name: 'Brushed Softstreme Ribbed Mid-Rise Zip-Flared Pant Women\'s 32.5"',
    brand: 'Lululemon',
    description: 'Crafted with our ultra-soft Softstreme fabric, these flared pants offer a flattering mid-rise fit with a zip-front design. Perfect for both low-impact workouts and everyday wear.',
    price: 1280000,
    originalPrice: 1580000,
    currency: 'Rp',

    postImages: [
      '/products/Lululemon - Softstreme Zip-Flared Pant/softstreme_eksplor1.webp',
      '/products/Lululemon - Softstreme Zip-Flared Pant/softstreme_eksplor2.webp'
    ],

    productImages: [
      '/Softstreme/IMG_0045.JPG',
      '/Softstreme/IMG_0044.JPG',
      '/Softstreme/IMG_0043.JPG',
      '/Softstreme/IMG_0042.JPG',
      '/Softstreme/IMG_0041.JPG',
      '/Softstreme/IMG_0040.JPG',
      '/Softstreme/IMG_0039.JPG'
    ],

    colors: [
      {
        id: 'softstreme-black',
        name: 'Black',
        label: 'Black',
        image: '/Softstreme/IMG_0045.JPG',
        stock: 15
      },
      {
        id: 'softstreme-navy',
        name: 'Navy',
        label: 'Navy',
        image: '/Softstreme/IMG_0044.JPG',
        stock: 10
      }
    ],

    sizes: [
      {
        id: '2',
        name: '2',
        price: 1280000,
        weight: 0.35,
        weightRecommendation: '45-52 kg',
        measurements: {
          waist: '64cm',
          hip: '88cm',
          inseam: '82cm',
          length: '82.5cm'
        }
      },
      {
        id: '4',
        name: '4',
        price: 1280000,
        weight: 0.38,
        weightRecommendation: '52-59 kg',
        measurements: {
          waist: '68cm',
          hip: '92cm',
          inseam: '82.5cm',
          length: '82.5cm'
        }
      },
      {
        id: '6',
        name: '6',
        price: 1280000,
        weight: 0.42,
        weightRecommendation: '59-67 kg',
        measurements: {
          waist: '72cm',
          hip: '96cm',
          inseam: '82.5cm',
          length: '82.5cm'
        }
      },
      {
        id: '8',
        name: '8',
        price: 1280000,
        weight: 0.45,
        weightRecommendation: '67-75 kg',
        measurements: {
          waist: '76cm',
          hip: '100cm',
          inseam: '82.5cm',
          length: '82.5cm'
        }
      }
    ],

    shippingOptions: [
      {
        id: 'jne-yes',
        name: 'JNE Yes',
        courier: 'JNE',
        service: 'YES',
        price: 35000,
        estimatedDays: '1 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'jne-reg',
        name: 'JNE Reguler',
        courier: 'JNE',
        service: 'Reguler',
        price: 18000,
        estimatedDays: '3-5 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'sicepat-best',
        name: 'SiCepat BEST',
        courier: 'SiCepat',
        service: 'BEST',
        price: 32000,
        estimatedDays: '2 Hari',
        isFree: false,
        isFast: true
      }
    ],

    vouchers: [
      {
        id: 'lulu-first',
        code: 'LULU10',
        discount: 10,
        discountType: 'percentage',
        minPurchase: 1000000,
        maxDiscount: 150000,
        validUntil: '2026-03-15',
        description: 'Diskon 10% s.d. Rp 150rb'
      }
    ],

    postData: {
      title: 'Softstreme Flared Pant yang Super Comfortable! 💜',
      content: ` Baru saja coba Softstreme Zip-Flared Pant dari Lululemon dan langsung jatuh cinta!
      BahannyaSoftstreme itu bener-bener lembut dan nyaman banget. Modelnya flare下面的设计让腿部线条看起来更修长，适合各种场合穿搭。`,
      tags: ['#Lululemon', '#Softstreme', '#FlaredPants', '#YogaStyle', '#WorkoutWear'],
      author: {
        name: 'Lululemon Lover',
        avatar: '',
        followerCount: 125000
      },
      location: 'Singapore',
      editedAt: '2 jam yang lalu',
      interactions: {
        likes: 8934,
        favorites: 3421,
        comments: 567
      }
    },

    productData: {
      rating: 4.9,
      reviewCount: 892,
      sold: '2.3K+',
      sizes: ['2', '4', '6', '8'],
      colors: ['Black', 'Navy'],
      category: 'Bottoms',
      categorySlug: 'bottoms',
      subcategory: 'Flare Pants',
      subcategorySlug: 'flare-pants',
      subtitle: 'Brushed Softstreme Ribbed Mid-Rise Zip-Flared Pant',
      sku: 'LULU-SOFT-PANT-001',
      stock: 35,
      discountPercentage: 19,
      badges: ['Diskon', 'Baru']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'lulu-softstreme-pant',
          position: { x: 50, y: 50 },
          imageIndex: 0
        }
      ]
    }
  },

  'lulu-swiftly-ls': {
    id: 'prod-lulu-swiftly-ls',
    slug: 'lulu-swiftly-ls',
    name: 'Swiftly Tech Long Sleeve 2.0 Crew Heathered',
    brand: 'Lululemon',
    description: 'Our iconic Swiftly Tech Long Sleeve now in a heathered finish. Features our Silverescent technology to keep you fresh during intense workouts. Perfect for running, training, or layering.',
    price: 780000,
    originalPrice: 980000,
    currency: 'Rp',

    postImages: [
      '/products/Lululemon - Swiftly Tech Long Sleeve/swiftly_eksplor1.webp',
      '/products/Lululemon - Swiftly Tech Long Sleeve/swiftly_eksplor2.webp',
      '/products/Lululemon - Swiftly Tech Long Sleeve/swiftly_eksplor3.webp'
    ],

    productImages: [
      '/Swiftly/IMG_0052.JPG',
      '/Swiftly/IMG_0051.JPG'
    ],

    colors: [
      {
        id: 'swiftly-heathered-grey',
        name: 'Heathered Grey',
        label: 'Heathered Grey',
        image: '/Swiftly/IMG_0052.JPG',
        stock: 20
      },
      {
        id: 'swiftly-heathered-blue',
        name: 'Heathered Blue',
        label: 'Heathered Blue',
        image: '/Swiftly/IMG_0051.JPG',
        stock: 15
      }
    ],

    sizes: [
      {
        id: 'xs',
        name: 'XS',
        price: 780000,
        weight: 0.22,
        weightRecommendation: '40-48 kg',
        measurements: {
          bust: '84cm',
          waist: '64cm',
          length: '63cm',
          sleeve: '60cm'
        }
      },
      {
        id: 's',
        name: 'S',
        price: 780000,
        weight: 0.25,
        weightRecommendation: '48-55 kg',
        measurements: {
          bust: '88cm',
          waist: '68cm',
          length: '65cm',
          sleeve: '62cm'
        }
      },
      {
        id: 'm',
        name: 'M',
        price: 780000,
        weight: 0.28,
        weightRecommendation: '55-63 kg',
        measurements: {
          bust: '92cm',
          waist: '72cm',
          length: '67cm',
          sleeve: '64cm'
        }
      },
      {
        id: 'l',
        name: 'L',
        price: 780000,
        weight: 0.32,
        weightRecommendation: '63-72 kg',
        measurements: {
          bust: '96cm',
          waist: '76cm',
          length: '69cm',
          sleeve: '66cm'
        }
      }
    ],

    shippingOptions: [
      {
        id: 'jne-yes',
        name: 'JNE Yes',
        courier: 'JNE',
        service: 'YES',
        price: 30000,
        estimatedDays: '1 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'jne-reg',
        name: 'JNE Reguler',
        courier: 'JNE',
        service: 'Reguler',
        price: 15000,
        estimatedDays: '3-5 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'sicepat-best',
        name: 'SiCepat BEST',
        courier: 'SiCepat',
        service: 'BEST',
        price: 28000,
        estimatedDays: '2 Hari',
        isFree: false,
        isFast: true
      }
    ],

    vouchers: [
      {
        id: 'swiftly-new',
        code: 'SWIFT15',
        discount: 15,
        discountType: 'percentage',
        minPurchase: 700000,
        maxDiscount: 100000,
        validUntil: '2026-03-01',
        description: 'Diskon 15% s.d. Rp 100rb'
      }
    ],

    postData: {
      title: 'Swiftly Tech Long Sleeve - Wajib Punya! ⭐',
      content: `Swiftly Tech Long Sleeve 2.0 dari Lululemon emang besteeller banget!
      Bahannya tech fabric yang breathable dan anti-bakteri. Cocok buat workout atau sehari-hari. Heathered finish-nya juga keren banget!`,
      tags: ['#Lululemon', '#Swiftly', '#TechFleece', '#RunningGear', '#FitnessFashion'],
      author: {
        name: 'Active Lifestyle',
        avatar: '',
        followerCount: 98700
      },
      location: 'Jakarta',
      editedAt: '4 jam yang lalu',
      interactions: {
        likes: 12453,
        favorites: 5632,
        comments: 892
      }
    },

    productData: {
      rating: 4.9,
      reviewCount: 2341,
      sold: '5.6K+',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Heathered Grey', 'Heathered Blue'],
      category: 'Tops',
      categorySlug: 'tops',
      subcategory: 'Long Sleeve',
      subcategorySlug: 'long-sleeve',
      subtitle: 'Swiftly Tech Long Sleeve 2.0 Crew Heathered',
      sku: 'LULU-SWIFT-LS-001',
      stock: 45,
      discountPercentage: 20,
      badges: ['Diskon', 'Terlaris']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'lulu-swiftly-ls',
          position: { x: 50, y: 51 },
          imageIndex: 0
        }
      ]
    }
  },

  'prada-tote-bag': {
    id: 'prod-prada-tote-bag',
    slug: 'prada-tote-bag',
    name: 'Black Medium Leather Tote Bag',
    brand: 'Prada',
    description: 'Elegant black leather tote bag from Prada. Crafted in Italy with premium calf leather, featuring iconic triangular logo plaque and spacious interior for your daily essentials.',
    price: 42500000,
    originalPrice: 48000000,
    currency: 'Rp',

    postImages: [
      '/products/Prada - Black Medium Leather Tote Bag/prada_eksplor1.webp',
      '/products/Prada - Black Medium Leather Tote Bag/prada_eksplor2.webp',
      '/products/Prada - Black Medium Leather Tote Bag/prada_eksplor3.webp',
      '/products/Prada - Black Medium Leather Tote Bag/prada_eksplor4.webp',
      '/products/Prada - Black Medium Leather Tote Bag/prada_eksplor5.webp'
    ],

    productImages: [
      '/Prada/IMG_0020.JPG',
      '/Prada/IMG_0021.JPG',
      '/Prada/IMG_0022.JPG',
      '/Prada/IMG_0023.JPG',
      '/Prada/IMG_0024.JPG',
      '/Prada/IMG_0025.JPG'
    ],

    colors: [
      {
        id: 'prada-black',
        name: 'Black',
        label: 'Black',
        image: '/Prada/IMG_0020.JPG',
        stock: 3
      }
    ],

    sizes: [
      {
        id: 'one-size',
        name: 'One Size',
        price: 42500000,
        weight: 0.85,
        weightRecommendation: '',
        measurements: {
          width: '35cm',
          height: '28cm',
          depth: '14cm',
          handle: '22cm'
        }
      }
    ],

    shippingOptions: [
      {
        id: 'dhl-express',
        name: 'DHL Express',
        courier: 'DHL',
        service: 'Express',
        price: 850000,
        estimatedDays: '3-5 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'fedex-ip',
        name: 'FedEx International Priority',
        courier: 'FedEx',
        service: 'IP',
        price: 750000,
        estimatedDays: '4-6 Hari',
        isFree: false,
        isFast: true
      }
    ],

    vouchers: [],

    postData: {
      title: 'Prada Tote Bag - Investasi Fashion yang Worth It! 🖤',
      content: `Finally got my hands on the Prada Medium Tote!
      Leather quality-nya premium banget, classic black yang never goes wrong. BIsa dipake ke kantor atau dinner. Definitely worth the investment!`,
      tags: ['#Prada', '#ToteBag', '#LuxuryBag', '#ItalianLeather', '#InvestmentPiece'],
      author: {
        name: 'Luxury Fashionista',
        avatar: '',
        followerCount: 234500
      },
      location: 'Milan',
      editedAt: '1 hari yang lalu',
      interactions: {
        likes: 34521,
        favorites: 12453,
        comments: 2134
      }
    },

    productData: {
      rating: 5.0,
      reviewCount: 156,
      sold: '89+',
      sizes: ['One Size'],
      colors: ['Black'],
      category: 'Bags',
      categorySlug: 'bags',
      subcategory: 'Tote Bags',
      subcategorySlug: 'tote-bags',
      subtitle: 'Black Medium Leather Tote Bag',
      sku: 'PRADA-TOTE-001',
      stock: 5,
      discountPercentage: 11,
      badges: ['Diskon', 'Luxury']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'prada-tote-bag',
          position: { x: 90, y: 50 },
          imageIndex: 0
        }
      ]
    }
  },

  'mm-tabi-flats': {
    id: 'prod-mm-tabi-flats',
    slug: 'mm-tabi-flats',
    name: 'Tabi Leather Ballerina Flats',
    brand: 'Maison Margiela',
    description: 'Iconic Tabi ankle tab leather ballerinas from Maison Margiela. Featuring the signature split-toe design, these shoes are a true fashion statement since 1988.',
    price: 18900000,
    originalPrice: 21500000,
    currency: 'Rp',

    postImages: [
      '/products/Maison Margiela - Tabi Ballerina Flats/mm_eksplor1.webp',
      '/products/Maison Margiela - Tabi Ballerina Flats/mm_eksplor2.webp',
      '/products/Maison Margiela - Tabi Ballerina Flats/mm_eksplor3.webp',
      '/products/Maison Margiela - Tabi Ballerina Flats/mm_eksplor4.webp',
      '/products/Maison Margiela - Tabi Ballerina Flats/mm_eksplor5.webp'
    ],

    productImages: [
      '/MM/IMG_0034.JPG',
      '/MM/IMG_0033.JPG',
      '/MM/IMG_0032.JPG',
      '/MM/IMG_0031.JPG',
      '/MM/IMG_0030.JPG'
    ],

    colors: [
      {
        id: 'tabi-black',
        name: 'Black',
        label: 'Black',
        image: '/MM/IMG_0034.JPG',
        stock: 4
      },
      {
        id: 'tabi-white',
        name: 'White',
        label: 'White',
        image: '/MM/IMG_0033.JPG',
        stock: 2
      }
    ],

    sizes: [
      {
        id: '35',
        name: '35',
        price: 18900000,
        weight: 0.35,
        weightRecommendation: '35 EU',
        measurements: {
          length: '22cm'
        }
      },
      {
        id: '36',
        name: '36',
        price: 18900000,
        weight: 0.38,
        weightRecommendation: '36 EU',
        measurements: {
          length: '23cm'
        }
      },
      {
        id: '37',
        name: '37',
        price: 18900000,
        weight: 0.40,
        weightRecommendation: '37 EU',
        measurements: {
          length: '24cm'
        }
      },
      {
        id: '38',
        name: '38',
        price: 18900000,
        weight: 0.42,
        weightRecommendation: '38 EU',
        measurements: {
          length: '25cm'
        }
      },
      {
        id: '39',
        name: '39',
        price: 18900000,
        weight: 0.45,
        weightRecommendation: '39 EU',
        measurements: {
          length: '26cm'
        }
      }
    ],

    shippingOptions: [
      {
        id: 'dhl-express',
        name: 'DHL Express',
        courier: 'DHL',
        service: 'Express',
        price: 650000,
        estimatedDays: '3-5 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'fedex-ip',
        name: 'FedEx International Priority',
        courier: 'FedEx',
        service: 'IP',
        price: 580000,
        estimatedDays: '4-6 Hari',
        isFree: false,
        isFast: true
      }
    ],

    vouchers: [],

    postData: {
      title: 'Maison Margiela Tabi - Iconic Fashion Statement! 👠',
      content: `Maison Margiela Tabi flats - the shoe that started it all!
      Split-toe design yang iconic ini emang bukan untuk yang takut standout. Quality leather dan craftsmanship yang luar biasa. A must-have untuk fashion collectors!`,
      tags: ['#MaisonMargiela', '#Tabi', '#BallerinaFlats', '#HighFashion', '#IconicDesign'],
      author: {
        name: 'Fashion Editor',
        avatar: '',
        followerCount: 456000
      },
      location: 'Paris',
      editedAt: '3 hari yang lalu',
      interactions: {
        likes: 45678,
        favorites: 18234,
        comments: 3456
      }
    },

    productData: {
      rating: 4.9,
      reviewCount: 89,
      sold: '45+',
      sizes: ['35', '36', '37', '38', '39'],
      colors: ['Black', 'White'],
      category: 'Shoes',
      categorySlug: 'shoes',
      subcategory: 'Flats',
      subcategorySlug: 'flats',
      subtitle: 'Tabi Leather Ballerina Flats',
      sku: 'MM-TABI-001',
      stock: 8,
      discountPercentage: 12,
      badges: ['Diskon', 'Luxury', 'Iconic']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'mm-tabi-flats',
          position: { x: 10, y: 90 },
          imageIndex: 0
        }
      ]
    }
  },

  'stanley-quencher': {
    id: 'prod-stanley-quencher',
    slug: 'stanley-quencher',
    name: 'Stanley x Jennie Quencher Luxe Tumbler 30 OZ',
    brand: 'Stanley 1913',
    description: 'Limited edition Stanley x Jennie Quencher Luxe Tumbler. Features Stanley\'s legendary insulation technology keeping drinks cold for 11 hours or hot for 7 hours.',
    price: 850000,
    originalPrice: 980000,
    currency: 'Rp',

    postImages: [
      '/products/Stanley - Jennie Quencher Luxe/stanley_eksplor1.webp',
      '/products/Stanley - Jennie Quencher Luxe/stanley_eksplor2.webp',
      '/products/Stanley - Jennie Quencher Luxe/stanley_eksplor3.webp',
      '/products/Stanley - Jennie Quencher Luxe/stanley_eksplor4.webp'
    ],

    productImages: [
      '/Stanley/IMG_0029.JPG',
      '/Stanley/IMG_0028.JPG',
      '/Stanley/IMG_0027.JPG',
      '/Stanley/IMG_0026.JPG'
    ],

    colors: [
      {
        id: 'quencher-nude',
        name: ' Jennie Nude',
        label: 'Jennie Nude',
        image: '/Stanley/IMG_0029.JPG',
        stock: 25
      },
      {
        id: 'quencher-black',
        name: 'Black',
        label: 'Black',
        image: '/Stanley/IMG_0028.JPG',
        stock: 20
      }
    ],

    sizes: [
      {
        id: '30oz',
        name: '30 OZ',
        price: 850000,
        weight: 0.68,
        weightRecommendation: '',
        measurements: {
          height: '10.5 inch',
          volume: '30 oz / 887 ml'
        }
      }
    ],

    shippingOptions: [
      {
        id: 'jne-yes',
        name: 'JNE Yes',
        courier: 'JNE',
        service: 'YES',
        price: 28000,
        estimatedDays: '1 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'jne-reg',
        name: 'JNE Reguler',
        courier: 'JNE',
        service: 'Reguler',
        price: 14000,
        estimatedDays: '3-5 Hari',
        isFree: true,
        isFast: false
      },
      {
        id: 'sicepat-reg',
        name: 'SiCepat Reguler',
        courier: 'SiCepat',
        service: 'Reguler',
        price: 12000,
        estimatedDays: '4-6 Hari',
        isFree: true,
        isFast: false
      }
    ],

    vouchers: [
      {
        id: 'stanley-deal',
        code: 'STANLEY25',
        discount: 25,
        discountType: 'percentage',
        minPurchase: 800000,
        maxDiscount: 200000,
        validUntil: '2026-02-28',
        description: 'Diskon 25% s.d. Rp 200rb'
      }
    ],

    postData: {
      title: 'Stanley x Jennie Quencher - Viral Cup yang Beneran Bagus! 🧊',
      content: `Stanley Quencher lagi viral dan bener-bener worth it!
      Isolasi nya bener-bener top, bisa keep minuman dingin sampe 11 jam. Finishing-nya premium dan Jennie edition-nya cute banget. Wajib punya!`,
      tags: ['#Stanley', '#Quencher', '#Jennie', '#Tumbler', '#HydrationGame'],
      author: {
        name: 'Lifestyle Hacks',
        avatar: '',
        followerCount: 178900
      },
      location: 'Los Angeles',
      editedAt: '5 jam yang lalu',
      interactions: {
        likes: 28934,
        favorites: 10234,
        comments: 1876
      }
    },

    productData: {
      rating: 4.8,
      reviewCount: 1567,
      sold: '3.2K+',
      sizes: ['30 OZ'],
      colors: ['Jennie Nude', 'Black'],
      category: 'Accessories',
      categorySlug: 'accessories',
      subcategory: 'Tumblers',
      subcategorySlug: 'tumblers',
      subtitle: 'x Jennie Quencher Luxe Tumbler 30 OZ',
      sku: 'STANLEY-Q-001',
      stock: 50,
      discountPercentage: 13,
      badges: ['Diskon', 'Viral', 'Terlaris']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'stanley-quencher',
          position: { x: 90, y: 90 },
          imageIndex: 0
        }
      ]
    }
  },

  // Multi-tagged posts
  'lulu-combo': {
    id: 'prod-lulu-combo',
    slug: 'lulu-combo',
    name: 'Lululemon Softstreme + Swiftly Combo',
    brand: 'Lululemon',
    description: 'The perfect combination of Lululemon\'s most popular pieces: Softstreme Flared Pant and Swiftly Tech Long Sleeve. Designed for the modern active lifestyle.',
    price: 2060000,
    originalPrice: 2560000,
    currency: 'Rp',

    postImages: [
      '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_eksplor1.webp',
      '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_eksplor2.webp',
      '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_eksplor3.webp',
      '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_eksplor4.webp'
    ],

    productImages: [
      '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_produk.webp',
      '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_eksplor1.webp',
      '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_eksplor2.webp'
    ],

    colors: [
      {
        id: 'combo-black',
        name: 'Black Combo',
        label: 'Black Combo',
        image: '/products/Lululemon - Softstreme Swiftly Combo/lulu_combo_produk.webp',
        stock: 10
      }
    ],

    sizes: [
      {
        id: 's-combo',
        name: 'Size S',
        price: 2060000,
        weight: 0.55,
        weightRecommendation: '48-63 kg',
        measurements: {}
      },
      {
        id: 'm-combo',
        name: 'Size M',
        price: 2060000,
        weight: 0.60,
        weightRecommendation: '55-72 kg',
        measurements: {}
      },
      {
        id: 'l-combo',
        name: 'Size L',
        price: 2060000,
        weight: 0.68,
        weightRecommendation: '63-80 kg',
        measurements: {}
      }
    ],

    shippingOptions: [
      {
        id: 'jne-yes',
        name: 'JNE Yes',
        courier: 'JNE',
        service: 'YES',
        price: 40000,
        estimatedDays: '1 Hari',
        isFree: false,
        isFast: true
      },
      {
        id: 'jne-reg',
        name: 'JNE Reguler',
        courier: 'JNE',
        service: 'Reguler',
        price: 20000,
        estimatedDays: '3-5 Hari',
        isFree: true,
        isFast: false
      }
    ],

    vouchers: [
      {
        id: 'combo-save',
        code: 'COMBO20',
        discount: 20,
        discountType: 'percentage',
        minPurchase: 2000000,
        maxDiscount: 300000,
        validUntil: '2026-03-01',
        description: 'Diskon 20% s.d. Rp 300rb untuk Combo'
      }
    ],

    postData: {
      title: 'Lululemon Softstreme + Swiftly - The Perfect Combo! 💜🖤',
      content: `Outfit combo yang paling banyak di-request akhirnya ada!
      Softstreme Flared Pant + Swiftly Tech Long Sleeve - the ultimate Lululemon outfit.
      Softstreme-nya comfy dan flattering, Swiftly-nya perfect untuk workout. Bikin percaya diri dan nyaman sepanjang hari!`,
      tags: ['#Lululemon', '#Softstreme', '#Swiftly', '#ComboDeal', '#Athleisure'],
      author: {
        name: 'Lululemon Indonesia',
        avatar: '',
        followerCount: 345000
      },
      location: 'Jakarta',
      editedAt: '6 jam yang lalu',
      interactions: {
        likes: 45234,
        favorites: 18234,
        comments: 2345
      }
    },

    productData: {
      rating: 4.9,
      reviewCount: 456,
      sold: '1.2K+',
      sizes: ['Size S', 'Size M', 'Size L'],
      colors: ['Black Combo'],
      category: 'Sets',
      categorySlug: 'sets',
      subcategory: 'Outfit Sets',
      subcategorySlug: 'outfit-sets',
      subtitle: 'Softstreme + Swiftly Combo',
      sku: 'LULU-COMBO-001',
      stock: 25,
      discountPercentage: 20,
      badges: ['Diskon', 'Combo', 'Terlaris']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'lulu-softstreme-pant',
          position: { x: 57, y: 60 },
          imageIndex: 0
        },
        {
          productSlug: 'lulu-swiftly-ls',
          position: { x: 55, y: 25 },
          imageIndex: 0
        }
      ]
    }
  },

  'prada-mm-stanley-combo': {
    id: 'prod-prada-mm-stanley-combo',
    slug: 'prada-mm-stanley-combo',
    name: 'Prada + Maison Margiela + Stanley Combo',
    brand: 'Luxury Collection',
    description: 'The ultimate luxury lifestyle combo featuring Prada tote bag, Maison Margiela Tabi flats, and Stanley Quencher. Perfect for the fashion-forward individual.',
    price: 63350000,
    originalPrice: 70500000,
    currency: 'Rp',

    postImages: [
      '/products/Prada+MM+Stanley Combo/combo_eksplor1.webp',
      '/products/Prada+MM+Stanley Combo/combo_eksplor2.webp',
      '/products/Prada+MM+Stanley Combo/combo_eksplor3.webp',
      '/products/Prada+MM+Stanley Combo/combo_eksplor4.webp'
    ],

    productImages: [
      '/products/Prada+MM+Stanley Combo/combo_produk.webp',
      '/products/Prada+MM+Stanley Combo/combo_eksplor1.webp',
      '/products/Prada+MM+Stanley Combo/combo_eksplor2.webp'
    ],

    colors: [
      {
        id: 'luxury-combo',
        name: 'Luxury Combo Set',
        label: 'Luxury Combo',
        image: '/products/Prada+MM+Stanley Combo/combo_produk.webp',
        stock: 2
      }
    ],

    sizes: [
      {
        id: 'combo-set',
        name: 'Complete Set',
        price: 63350000,
        weight: 2.5,
        weightRecommendation: '',
        measurements: {}
      }
    ],

    shippingOptions: [
      {
        id: 'dhl-collect',
        name: 'DHL Express Collect',
        courier: 'DHL',
        service: 'Express',
        price: 1500000,
        estimatedDays: '3-5 Hari',
        isFree: false,
        isFast: true
      }
    ],

    vouchers: [],

    postData: {
      title: 'Luxury Trio: Prada + MM + Stanley 💎',
      content: `The ultimate luxury lifestyle trio is here!
      Prada Black Tote Bag untuk daily essentials yang stylish,
      Maison Margiela Tabi untuk statement footwear,
      Stanley Quencher untuk hydration yang tetap luxe.
      Three icons, one perfect combo.`,
      tags: ['#Prada', '#MaisonMargiela', '#Stanley', '#LuxuryCombo', '#LifestyleGoals'],
      author: {
        name: 'Luxury Lifestyle ID',
        avatar: '',
        followerCount: 567000
      },
      location: 'Singapore',
      editedAt: '1 hari yang lalu',
      interactions: {
        likes: 78901,
        favorites: 34521,
        comments: 5678
      }
    },

    productData: {
      rating: 5.0,
      reviewCount: 34,
      sold: '18+',
      sizes: ['Complete Set'],
      colors: ['Luxury Combo Set'],
      category: 'Sets',
      categorySlug: 'sets',
      subcategory: 'Luxury Sets',
      subcategorySlug: 'luxury-sets',
      subtitle: 'Prada + MM + Stanley Ultimate Combo',
      sku: 'LUX-COMBO-001',
      stock: 5,
      discountPercentage: 10,
      badges: ['Diskon', 'Luxury', 'Limited']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'prada-tote-bag',
          position: { x: 81, y: 48 },
          imageIndex: 0
        },
        {
          productSlug: 'mm-tabi-flats',
          position: { x: 12, y: 95 },
          imageIndex: 0
        },
        {
          productSlug: 'stanley-quencher',
          position: { x: 52, y: 73 },
          imageIndex: 0
        }
      ]
    }
  }
};

// Helper function to get product by slug
export function getProductBySlug(slug: string): ProductData | undefined {
  return productsData[slug];
}

// Get all product slugs for static generation
export function getAllProductSlugs(): string[] {
  return Object.keys(productsData);
}

// Get products by tag slugs
export function getProductsByTags(tags: ProductTag[]): Array<ProductData & { tag: ProductTag }> {
  return tags
    .map(tag => {
      const product = productsData[tag.productSlug];
      return product ? { ...product, tag } : null;
    })
    .filter(Boolean) as Array<ProductData & { tag: ProductTag }>;
}
