export interface LiveViewer {
  id: string;
  username: string;
  avatar: string;
  isVerified?: boolean;
}

export interface LiveComment {
  id: string;
  user: LiveViewer;
  text: string;
  timestamp: Date;
  type: 'comment' | 'join' | 'gift' | 'rose';
  giftValue?: number; // for gifts/roses
}

export interface LiveProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  inStock: boolean;
  cardNumber?: number; // 01, 02, etc. for multiple products
}

export interface LiveStream {
  id: string;
  seller: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
    isFollowing: boolean;
  };
  title: string;
  description: string;
  viewerCount: number;
  likeCount: number;
  isLive: true; // Always true for live streams
  currentProduct?: LiveProduct;
  products: LiveProduct[];
  viewers: LiveViewer[];
  comments: LiveComment[];
  startedAt: Date;
}

// Mock data interfaces
export interface MockComment {
  user: string;
  avatar: string;
  text: string;
  type?: 'comment' | 'join' | 'gift' | 'rose';
}

export interface MockGift {
  name: string;
  icon: string;
  value: number;
}