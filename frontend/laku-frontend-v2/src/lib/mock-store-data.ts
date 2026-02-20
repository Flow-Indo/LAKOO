import type { Store, StoreProduct, StoreCategory, StoreReview, StoreCollection } from '@/types/store';

export const mockStoreProducts: StoreProduct[] = [
  {
    id: 'prod-1',
    name: 'Premium Cotton T-Shirt - Casual Wear',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    price: 89000,
    originalPrice: 129000,
    discount: 31,
    rating: 4.8,
    reviewCount: 234,
    sold: '1.2K+',
    category: 'T-Shirts',
    tags: ['Cotton', 'Casual', 'Basic'],
    isBestSeller: true,
    shipping: { free: true, express: true }
  },
  {
    id: 'prod-2',
    name: 'Slim Fit Denim Jeans - Dark Blue',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
    price: 299000,
    rating: 4.6,
    reviewCount: 156,
    sold: '800+',
    category: 'Jeans',
    tags: ['Denim', 'Slim Fit', 'Dark Blue'],
    shipping: { free: true, express: false }
  },
  {
    id: 'prod-3',
    name: 'Athletic Running Shoes - Performance Series',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
    price: 450000,
    originalPrice: 550000,
    discount: 18,
    rating: 4.9,
    reviewCount: 89,
    sold: '450+',
    category: 'Shoes',
    tags: ['Running', 'Athletic', 'Performance'],
    isNew: true,
    shipping: { free: true, express: true }
  },
  {
    id: 'prod-4',
    name: 'Classic Leather Wallet - RFID Blocking',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
    price: 165000,
    rating: 4.7,
    reviewCount: 312,
    sold: '2.1K+',
    category: 'Accessories',
    tags: ['Leather', 'RFID', 'Classic'],
    isBestSeller: true,
    shipping: { free: true, express: false }
  },
  {
    id: 'prod-5',
    name: 'Winter Hoodie - Fleece Lined',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    price: 225000,
    originalPrice: 299000,
    discount: 25,
    rating: 4.5,
    reviewCount: 178,
    sold: '950+',
    category: 'Hoodies',
    tags: ['Winter', 'Fleece', 'Warm'],
    shipping: { free: true, express: true }
  },
  {
    id: 'prod-6',
    name: 'Stylish Sunglasses - UV Protection',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop',
    price: 195000,
    rating: 4.4,
    reviewCount: 267,
    sold: '1.5K+',
    category: 'Accessories',
    tags: ['Sunglasses', 'UV Protection', 'Stylish'],
    shipping: { free: false, express: false }
  }
];

export const mockStoreCategories: StoreCategory[] = [
  {
    id: 'cat-1',
    name: 'T-Shirts',
    productCount: 45,
    subcategories: [
      { id: 'sub-1', name: 'Cotton Tees', productCount: 23 },
      { id: 'sub-2', name: 'Graphic Tees', productCount: 12 },
      { id: 'sub-3', name: 'Polo Shirts', productCount: 10 }
    ]
  },
  {
    id: 'cat-2',
    name: 'Jeans & Pants',
    productCount: 32,
    subcategories: [
      { id: 'sub-4', name: 'Slim Fit', productCount: 15 },
      { id: 'sub-5', name: 'Straight Fit', productCount: 10 },
      { id: 'sub-6', name: 'Cargo Pants', productCount: 7 }
    ]
  },
  {
    id: 'cat-3',
    name: 'Shoes',
    productCount: 28,
    subcategories: [
      { id: 'sub-7', name: 'Sneakers', productCount: 18 },
      { id: 'sub-8', name: 'Boots', productCount: 6 },
      { id: 'sub-9', name: 'Sandals', productCount: 4 }
    ]
  },
  {
    id: 'cat-4',
    name: 'Accessories',
    productCount: 67,
    subcategories: [
      { id: 'sub-10', name: 'Wallets', productCount: 23 },
      { id: 'sub-11', name: 'Belts', productCount: 15 },
      { id: 'sub-12', name: 'Sunglasses', productCount: 12 },
      { id: 'sub-13', name: 'Watches', productCount: 17 }
    ]
  },
  {
    id: 'cat-5',
    name: 'Hoodies & Sweatshirts',
    productCount: 19,
    subcategories: [
      { id: 'sub-14', name: 'Hoodies', productCount: 12 },
      { id: 'sub-15', name: 'Sweatshirts', productCount: 7 }
    ]
  }
];

export const mockStoreReviews: StoreReview[] = [
  {
    id: 'review-1',
    user: {
      id: 'user-1',
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    rating: 5,
    comment: 'Excellent quality and fast shipping! The product arrived exactly as described. Highly recommend this seller.',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop'],
    productName: 'Premium Cotton T-Shirt',
    helpful: 12,
    createdAt: new Date('2024-01-15'),
    sellerReply: {
      comment: 'Thank you for your kind words! We\'re glad you love our product. 😊',
      createdAt: new Date('2024-01-16')
    }
  },
  {
    id: 'review-2',
    user: {
      id: 'user-2',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    rating: 4,
    comment: 'Good product overall. Fits well and the material is comfortable. Only minor issue with packaging.',
    productName: 'Slim Fit Denim Jeans',
    helpful: 8,
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'review-3',
    user: {
      id: 'user-3',
      name: 'Maya R.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isVerified: false
    },
    rating: 5,
    comment: 'Amazing customer service! Had a question about sizing and they responded within minutes. Product is perfect.',
    productName: 'Athletic Running Shoes',
    helpful: 15,
    createdAt: new Date('2024-01-08'),
    sellerReply: {
      comment: 'Thank you for the 5-star review! We\'re here to help with any questions. Happy running! 🏃‍♀️',
      createdAt: new Date('2024-01-09')
    }
  }
];

export const mockStoreCollections: StoreCollection[] = [
  {
    id: 'collection-1',
    name: 'Best Sellers',
    description: 'Our most popular items loved by customers',
    products: mockStoreProducts.filter(p => p.isBestSeller),
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop'
  },
  {
    id: 'collection-2',
    name: 'New Arrivals',
    description: 'Latest products in our collection',
    products: mockStoreProducts.filter(p => p.isNew),
    coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'
  },
  {
    id: 'collection-3',
    name: 'Winter Collection',
    description: 'Stay warm with our winter essentials',
    products: mockStoreProducts.filter(p => p.tags.includes('Winter') || p.tags.includes('Warm')),
    coverImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop'
  }
];

// Store-scoped assets for store-specific UI images
export const storeAssets: Record<
  string,
  {
    carouselImages: string[];
    detailCarousel: { background: string; images: { src: string; height?: string; y?: string }[] };
    productShowImages: { src: string; y?: string; x?: string; scale?: number }[];
    shirts: string[];
    pants: string[];
    shirtsProducts?: Array<{
      id: string;
      src: string;
      name: string;
      variation: string;
      price: number;
      originalPrice: number;
    }>;
    pantsProducts?: Array<{
      id: string;
      src: string;
      name: string;
      variation: string;
      price: number;
      originalPrice: number;
    }>;
  }
> = {
  'store-001': {
    carouselImages: [
      '/jeans/jean_mock_images2/IMG_9976.JPG',
      '/jeans/jean_mock_images2/IMG_9977.JPG',
      '/jeans/jean_mock_images2/IMG_9978.JPG',
      '/jeans/jean_mock_images2/IMG_9979.JPG',
    ],
    detailCarousel: {
      background: '/viena/bgrb.png',
      images: [
        { src: '/viena/rb1.png', height: '500px', y: '0%' },
        { src: '/viena/rb2.png', height: '500px', y: '0%' },
        { src: '/viena/rb3.png', height: '550px', y: '0%' },
      ],
    },
    productShowImages: [
      { src: '/viena/rb1.png', y: '0%', x: '0%', scale: 120 },
      { src: '/viena/rb2.png', y: '0%', x: '0%', scale: 120 },
      { src: '/viena/rb3.png', y: '-5%', x: '0%', scale: 120 },
      { src: '/viena/rb1.png', y: '0%', x: '0%', scale: 120 },
      { src: '/viena/rb2.png', y: '0%', x: '0%', scale: 120 },
      { src: '/viena/rb3.png', y: '0%', x: '0%', scale: 120 },
      { src: '/viena/rb1.png', y: '0%', x: '0%', scale: 120 },
      { src: '/viena/rb2.png', y: '0%', x: '0%', scale: 120 },
      { src: '/viena/rb3.png', y: '0%', x: '0%', scale: 120 },
    ],
    shirts: [
      '/viena/atasan1-removebg-preview.png',
      '/viena/atasan2-removebg-preview.png',
    ],
    pants: [
      '/viena/celana1-removebg-preview.png',
      '/viena/celana2-removebg-preview.png',
    ],
    // Detailed products used by virtual fit (mock product metadata)
    shirtsProducts: [
      {
        id: 's-1',
        src: '/viena/atasan1-removebg-preview.png',
        name: 'Denim Overshirt',
        variation: 'Size: M, Color: Blue',
        price: 150000,
        originalPrice: 200000
      },
      {
        id: 's-2',
        src: '/viena/atasan2-removebg-preview.png',
        name: 'Chambray Shirt',
        variation: 'Size: M, Color: Light Blue',
        price: 140000,
        originalPrice: 0
      }
    ],
    pantsProducts: [
      {
        id: 'p-1',
        src: '/viena/celana1-removebg-preview.png',
        name: 'Wide Cargo Pants',
        variation: 'Size: M, Color: Black',
        price: 180000,
        originalPrice: 220000
      },
      {
        id: 'p-2',
        src: '/viena/celana2-removebg-preview.png',
        name: 'Relaxed Jeans',
        variation: 'Size: M, Color: Indigo',
        price: 170000,
        originalPrice: 0
      }
    ],
  },
};

export const mockStore: Store = {
  id: 'store-001',
  name: 'PYNKI SWEAR STORE',
  logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop&crop=center',
  banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
  verified: true,
  rating: 4.7,
  productCount: 1567,
  followers: 275000,
  description: 'Premium fashion retailer specializing in quality clothing and accessories. We focus on trendy, comfortable, and affordable fashion for everyone.',
  location: 'Jakarta, Indonesia',
  joinedDate: new Date('2020-03-15'),
  isFollowing: false,

  performance: {
    productQuality: 4.8,
    shippingSpeed: 4.6,
    customerService: 4.9,
    responseRate: 98,
    shipOnTimeRate: 96,
    returnRate: 2.1,
    customerSatisfaction: 94
  },

  badges: [
    { id: 'badge-1', name: 'Choice Store', type: 'choice' },
    { id: 'badge-2', name: '500K+ Sold Recently', type: 'achievement' },
    { id: 'badge-3', name: '99K+ Repeat Customers', type: 'achievement' },
    { id: 'badge-4', name: 'VIP Seller', type: 'vip' }
  ],

  stats: {
    totalSales: '500K+',
    repurchaseRate: '99K+',
    responseTime: 'within 1 hour',
    yearsActive: 4
  },

  categories: mockStoreCategories,
  products: mockStoreProducts,
  collections: mockStoreCollections,
  reviews: mockStoreReviews,

  policies: {
    cod: true,
    return: true,
    returnPeriod: 7,
    shipping: true,
    warranty: true
  },

  seo: {
    title: 'FashionForward - Premium Fashion & Accessories | LAKU',
    description: 'Shop premium fashion, clothing, and accessories at FashionForward. Quality products, fast shipping, and excellent customer service.',
    keywords: ['fashion', 'clothing', 'accessories', 'premium', 'quality', 'trendy']
  }
};