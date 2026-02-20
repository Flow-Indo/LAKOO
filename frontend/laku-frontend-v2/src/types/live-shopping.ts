export interface LiveShopProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number; // percentage
  stock: number;
  sold: number;
  rating: number;
  inStock: boolean;
}

export interface LiveShop {
  id: string;
  name: string;
  logo: string;
  rating: number;
  followers: number;
  isFollowing: boolean;
  isVerified: boolean;
}

export interface LiveShoppingVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  isLive: boolean; // true if currently live streaming

  // Shop/Seller info
  shop: LiveShop;

  // Featured products in this video
  products: LiveShopProduct[];
  currentProductIndex: number; // which product is being showcased

  // Video metadata
  title: string;
  description: string;
  category: string;

  // Feed type for TikTok-style categorization
  feedType: 'following' | 'foryou';

  // Engagement (less important than social media)
  viewers: number; // current live viewers or total views
  likes: number;
  comments: number;
  shares: number;

  // User state
  isLiked: boolean;

  createdAt: Date;
}

export type LiveCategory =
  | 'all'
  | 'following'
  | 'fashion'
  | 'beauty'
  | 'electronics';