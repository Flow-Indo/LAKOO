import { Product } from '@/types';
import { MOCK_PRODUCTS } from './mock-data';

export interface LiveVideo {
  id: string;
  videoUrl: string;      // For now: placeholder or sample URL
  thumbnail: string;     // Unsplash image
  product: Product;      // Link to existing product
  store: {
    id: string;
    name: string;
    avatar: string;
    followers: number;
  };
  host: {
    name: string;
    avatar: string;
  };
  viewers: number;       // Current live viewers
  likes: number;
  startedAt: string;     // ISO timestamp
  tags: string[];        // "Fashion", "Flash Sale", etc.
}

// Sample video URLs from Google test videos
const SAMPLE_VIDEO_URLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
];

const HOST_NAMES = [
  'Sarah Fashionista',
  'Tech Guru Alex',
  'Beauty Queen Maya',
  'Home Decor Lisa',
  'Sport Master Kevin',
  'Foodie Chef Rita',
  'Book Lover Emma',
  'Toy Expert Mike',
  'Auto Pro Daniel',
  'Gadget Wiz Sophia'
];

const STORE_FOLLOWERS = [12500, 8900, 15600, 7200, 23400, 18700, 9100, 13800, 19600, 11200];

export const MOCK_LIVE_VIDEOS: LiveVideo[] = [
  {
    id: 'live-1',
    videoUrl: SAMPLE_VIDEO_URLS[0],
    thumbnail: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    product: MOCK_PRODUCTS[0], // Batik Tulis Jogja Premium
    store: {
      id: MOCK_PRODUCTS[0].store.id,
      name: MOCK_PRODUCTS[0].store.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_PRODUCTS[0].store.name)}&background=random&size=100`,
      followers: STORE_FOLLOWERS[0]
    },
    host: {
      name: HOST_NAMES[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(HOST_NAMES[0])}&background=ff6b6b&color=white&size=100`
    },
    viewers: 15420,
    likes: 2340,
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    tags: ['Fashion', 'Traditional', 'Flash Sale']
  },
  {
    id: 'live-2',
    videoUrl: SAMPLE_VIDEO_URLS[1],
    thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    product: MOCK_PRODUCTS[1], // Kopi Arabica Gayo Premium
    store: {
      id: MOCK_PRODUCTS[1].store.id,
      name: MOCK_PRODUCTS[1].store.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_PRODUCTS[1].store.name)}&background=random&size=100`,
      followers: STORE_FOLLOWERS[1]
    },
    host: {
      name: HOST_NAMES[1],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(HOST_NAMES[1])}&background=4ecdc4&color=white&size=100`
    },
    viewers: 8920,
    likes: 1560,
    startedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(), // 32 minutes ago
    tags: ['Food', 'Coffee', 'Premium']
  },
  {
    id: 'live-3',
    videoUrl: SAMPLE_VIDEO_URLS[2],
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    product: MOCK_PRODUCTS[2], // Tenun Ikat Sumba Tradisional
    store: {
      id: MOCK_PRODUCTS[2].store.id,
      name: MOCK_PRODUCTS[2].store.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_PRODUCTS[2].store.name)}&background=random&size=100`,
      followers: STORE_FOLLOWERS[2]
    },
    host: {
      name: HOST_NAMES[2],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(HOST_NAMES[2])}&background=ffd93d&color=black&size=100`
    },
    viewers: 23100,
    likes: 3450,
    startedAt: new Date(Date.now() - 67 * 60 * 1000).toISOString(), // 67 minutes ago
    tags: ['Fashion', 'Traditional', 'Handmade']
  },
  {
    id: 'live-4',
    videoUrl: SAMPLE_VIDEO_URLS[3],
    thumbnail: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400',
    product: MOCK_PRODUCTS[3], // Madu Hutan Kalimantan 1kg
    store: {
      id: MOCK_PRODUCTS[3].store.id,
      name: MOCK_PRODUCTS[3].store.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_PRODUCTS[3].store.name)}&background=random&size=100`,
      followers: STORE_FOLLOWERS[3]
    },
    host: {
      name: HOST_NAMES[3],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(HOST_NAMES[3])}&background=6bcf7f&color=white&size=100`
    },
    viewers: 6780,
    likes: 890,
    startedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(), // 28 minutes ago
    tags: ['Food', 'Health', 'Natural']
  },
  {
    id: 'live-5',
    videoUrl: SAMPLE_VIDEO_URLS[4],
    thumbnail: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
    product: MOCK_PRODUCTS[4], // Kerajinan Perak Khas Yogyakarta
    store: {
      id: MOCK_PRODUCTS[4].store.id,
      name: MOCK_PRODUCTS[4].store.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_PRODUCTS[4].store.name)}&background=random&size=100`,
      followers: STORE_FOLLOWERS[4]
    },
    host: {
      name: HOST_NAMES[4],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(HOST_NAMES[4])}&background=c44569&color=white&size=100`
    },
    viewers: 34500,
    likes: 5670,
    startedAt: new Date(Date.now() - 89 * 60 * 1000).toISOString(), // 89 minutes ago
    tags: ['Fashion', 'Jewelry', 'Craft']
  },
  {
    id: 'live-6',
    videoUrl: SAMPLE_VIDEO_URLS[5],
    thumbnail: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400',
    product: MOCK_PRODUCTS[5], // Gula Semut Merah Premium 250g
    store: {
      id: MOCK_PRODUCTS[5].store.id,
      name: MOCK_PRODUCTS[5].store.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_PRODUCTS[5].store.name)}&background=random&size=100`,
      followers: STORE_FOLLOWERS[5]
    },
    host: {
      name: HOST_NAMES[5],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(HOST_NAMES[5])}&background=f0932b&color=white&size=100`
    },
    viewers: 12300,
    likes: 2100,
    startedAt: new Date(Date.now() - 53 * 60 * 1000).toISOString(), // 53 minutes ago
    tags: ['Food', 'Sweetener', 'Organic']
  },
  {
    id: 'live-7',
    videoUrl: SAMPLE_VIDEO_URLS[6],
    thumbnail: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=400',
    product: MOCK_PRODUCTS[6], // Batik Cap Modern Motif Abstrak
    store: {
      id: MOCK_PRODUCTS[6].store.id,
      name: MOCK_PRODUCTS[6].store.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_PRODUCTS[6].store.name)}&background=random&size=100`,
      followers: STORE_FOLLOWERS[6]
    },
    host: {
      name: HOST_NAMES[6],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(HOST_NAMES[6])}&background=3742fa&color=white&size=100`
    },
    viewers: 18700,
    likes: 2890,
    startedAt: new Date(Date.now() - 41 * 60 * 1000).toISOString(), // 41 minutes ago
    tags: ['Fashion', 'Modern', 'Batik']
  },
  {
    id: 'live-8',
    videoUrl: SAMPLE_VIDEO_URLS[7],
    thumbnail: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400',
    product: MOCK_PRODUCTS[7], // Kopi Luwak Special Reserve 200g
    store: {
      id: MOCK_PRODUCTS[7].store.id,
      name: MOCK_PRODUCTS[7].store.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_PRODUCTS[7].store.name)}&background=random&size=100`,
      followers: STORE_FOLLOWERS[7]
    },
    host: {
      name: HOST_NAMES[7],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(HOST_NAMES[7])}&background=a29bfe&color=white&size=100`
    },
    viewers: 45600,
    likes: 6780,
    startedAt: new Date(Date.now() - 76 * 60 * 1000).toISOString(), // 76 minutes ago
    tags: ['Food', 'Coffee', 'Luxury']
  },
  {
    id: 'live-9',
    videoUrl: SAMPLE_VIDEO_URLS[8],
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
    product: MOCK_PRODUCTS[1], // Using another coffee product for variety
    store: {
      id: MOCK_PRODUCTS[1].store.id,
      name: MOCK_PRODUCTS[1].store.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_PRODUCTS[1].store.name)}&background=random&size=100`,
      followers: STORE_FOLLOWERS[8]
    },
    host: {
      name: HOST_NAMES[8],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(HOST_NAMES[8])}&background=e17055&color=white&size=100`
    },
    viewers: 7890,
    likes: 1240,
    startedAt: new Date(Date.now() - 19 * 60 * 1000).toISOString(), // 19 minutes ago
    tags: ['Automotive', 'Tools', 'DIY']
  },
  {
    id: 'live-10',
    videoUrl: SAMPLE_VIDEO_URLS[9],
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b827?w=400',
    product: MOCK_PRODUCTS[3], // Using honey product again for variety
    store: {
      id: MOCK_PRODUCTS[3].store.id,
      name: MOCK_PRODUCTS[3].store.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_PRODUCTS[3].store.name)}&background=random&size=100`,
      followers: STORE_FOLLOWERS[9]
    },
    host: {
      name: HOST_NAMES[9],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(HOST_NAMES[9])}&background=00b894&color=white&size=100`
    },
    viewers: 29800,
    likes: 4320,
    startedAt: new Date(Date.now() - 112 * 60 * 1000).toISOString(), // 112 minutes ago
    tags: ['Electronics', 'Gadgets', 'Tech']
  }
];

// Helper function to get active live videos (started within last 2 hours)
export const getActiveLiveVideos = () => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  return MOCK_LIVE_VIDEOS.filter(video =>
    new Date(video.startedAt) > twoHoursAgo
  );
};

// Helper function to get live videos by category
export const getLiveVideosByTag = (tag: string) => {
  return MOCK_LIVE_VIDEOS.filter(video =>
    video.tags.includes(tag)
  );
};

// Helper function to get most popular live videos
export const getPopularLiveVideos = (limit: number = 5) => {
  return [...MOCK_LIVE_VIDEOS]
    .sort((a, b) => b.viewers - a.viewers)
    .slice(0, limit);
};