export interface StorePerformance {
  productQuality: number; // 0-5
  shippingSpeed: number; // 0-5
  customerService: number; // 0-5
  responseRate: number; // 0-100
  shipOnTimeRate: number; // 0-100
  returnRate: number; // 0-100
  customerSatisfaction: number; // 0-100
}

export interface StoreBadge {
  id: string;
  name: string;
  type: 'trending' | 'verified' | 'choice' | 'vip' | 'achievement';
  icon?: string;
}

export interface StoreCategory {
  id: string;
  name: string;
  productCount: number;
  icon?: string;
  subcategories?: StoreCategory[];
}

export interface StoreReview {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  rating: number;
  comment: string;
  images?: string[];
  videos?: string[];
  productName: string;
  variant?: string;
  helpful: number;
  createdAt: Date;
  sellerReply?: {
    comment: string;
    createdAt: Date;
  };
}

export interface StoreProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  sold: string; // e.g., "1.2k+"
  category: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  shipping: {
    free: boolean;
    express: boolean;
  };
}

export interface StoreCollection {
  id: string;
  name: string;
  description?: string;
  products: StoreProduct[];
  coverImage?: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  banner?: string;
  verified: boolean;
  rating: number;
  productCount: number;
  followers: number;
  description: string;
  location: string;
  joinedDate: Date;
  isFollowing: boolean;

  // Performance metrics
  performance: StorePerformance;
  badges: StoreBadge[];

  // Statistics
  stats: {
    totalSales: string; // e.g., "500K+"
    repurchaseRate: string; // e.g., "99K+"
    responseTime: string; // e.g., "within 1 hour"
    yearsActive: number;
  };

  // Content
  categories: StoreCategory[];
  products: StoreProduct[];
  collections: StoreCollection[];
  reviews: StoreReview[];

  // Policies
  policies: {
    cod: boolean;
    return: boolean;
    returnPeriod: number; // days
    shipping: boolean;
    warranty: boolean;
  };

  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface StoreFilter {
  categories?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  rating?: number; // minimum rating (1-5)
  shipping?: {
    free?: boolean;
    express?: boolean;
  };
  discount?: boolean;
  condition?: 'new' | 'like-new' | 'used';
  sortBy?: StoreSortOption;
}

export type StoreSortOption =
  | 'recommended'
  | 'best-selling'
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'newest'
  | 'top-rated'
  | 'most-reviewed';

export type StoreTab = 'home' | 'products' | 'tags' | 'chat';

export interface StoreTabItem {
  id: StoreTab;
  label: string;
  count?: number;
}

// Store data interface for brand store pages
export interface StoreStory {
  about: string;
  mission: string;
  founded: string;
}

export interface StoreData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string; // Hero banner image
  logoImage: string;

  // Social & Contact
  instagram?: string;
  website?: string;
  location: string;

  // Stats
  followers: number;
  totalSold: number; // Total products sold by the store
  productsCount: number;
  rating: number;

  // Story
  story: StoreStory;

  // Related product slugs
  productSlugs: string[];

  // Highlights/Categories
  categories: string[];
}