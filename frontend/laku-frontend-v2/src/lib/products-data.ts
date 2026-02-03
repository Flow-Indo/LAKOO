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
