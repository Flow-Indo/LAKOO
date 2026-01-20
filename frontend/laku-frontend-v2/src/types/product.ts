export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  image?: string;
  available: boolean;
  stock: number;
  price?: number; // Different variants might have different prices
}

export interface ProductSize {
  id: string;
  name: string;
  value: string;
  available: boolean;
  stock: number;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    length?: number;
    footLength?: number;
  };
}

export interface ProductSeller {
  id: string;
  name: string;
  logo: string;
  rating: number;
  followers: number;
  sold: string; // e.g., "500K+"
  repurchaseRate: string; // e.g., "99K+"
  isTrending: boolean;
  isVerified: boolean;
  qualityScore: number; // 0-5
  shippingScore: number; // 0-5
  serviceScore: number; // 0-5
  isFollowing: boolean;
}

export interface ProductShipping {
  destination: string;
  method: string;
  free: boolean;
  estimatedDelivery: string;
  provider?: string;
  cost?: number;
}

export interface ProductSpecification {
  material: string;
  season: string;
  style: string;
  fit: string;
  care: string[];
  origin: string;
  brand?: string;
  model?: string;
  warranty?: string;
}

export interface ProductReview {
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
  variant?: string;
  helpful: number;
  createdAt: Date;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  sold: string;
  seller: {
    name: string;
    isTrending: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  tags: string[];
  variants: {
    sizes?: ProductSize[];
    colors?: ProductVariant[];
  };
  stock: number;
  minOrder: number;
  maxOrder: number;
  seller: ProductSeller;
  shipping: ProductShipping;
  specifications: ProductSpecification;
  reviews: ProductReview[];
  recommendations: ProductRecommendation[];
  sizeChart?: {
    measurements: string[];
    sizes: Array<{
      size: string;
      measurements: number[];
      fit: string;
    }>;
  };
  policies: {
    cod: boolean;
    return: boolean;
    returnPeriod: number;
    warranty: boolean;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface ProductTab {
  id: 'goods' | 'details' | 'recommend';
  label: string;
  count?: number;
}

export type ProductSortOption =
  | 'most-recent'
  | 'highest-rating'
  | 'lowest-rating'
  | 'most-helpful';

export type ProductFilterOption = 1 | 2 | 3 | 4 | 5 | 'verified';