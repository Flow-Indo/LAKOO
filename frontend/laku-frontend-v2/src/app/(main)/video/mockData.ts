export type Creator = {
  id: string;
  name: string;
  avatar: string;
  followers: number;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  storeId?: string;
  description?: string;
  gallery?: string[];
};

export type LiveVideo = {
  id: string;
  videoUrl: string;
  thumbnail?: string;
  creator: Creator;
  viewers: number;
  likes: number;
  featuredProduct?: Product;
};

export const mockLiveVideos: LiveVideo[] = [
  {
    id: 'v1',
    // use empty videoUrl so the player falls back to a reliable external sample
    videoUrl: '',
    thumbnail: '/images/thumb1.jpg',
    creator: {
      id: 'c1',
      name: 'Rina Store',
      avatar: '/images/avatar1.jpg',
      followers: 12400,
    },
    viewers: 5200,
    likes: 12000,
    featuredProduct: {
      id: 'p1',
      title: 'Soft Adult Toothbrush (2 pack)',
      price: 9.9,
      image: '/images/product1.jpg',
      description:
        'Soft bristles, ergonomic handle, and individually wrapped for hygiene. Ideal for sensitive gums and daily use.',
      gallery: ['/images/product1.jpg', '/images/product1-2.jpg'],
    },
  },
  {
    id: 'v2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-clothing-in-a-urban-setting-4687-large.mp4',
    thumbnail: '/images/thumb2.jpg',
    creator: {
      id: 'c2',
      name: 'TeethCare',
      avatar: '/images/avatar2.jpg',
      followers: 8400,
    },
    viewers: 3200,
    likes: 4200,
    featuredProduct: {
      id: 'p2',
      title: 'Whitening Paste - 100g',
      price: 4.5,
      image: '/images/product2.jpg',
      description:
        'Enriched with natural enzymes to gently remove stains and freshen breath. Safe for enamel with daily use.',
      gallery: ['/images/product2.jpg', '/images/product2-2.jpg'],
    },
  },
  {
    id: 'v3',
    videoUrl: '',
    thumbnail: '/images/thumb3.jpg',
    creator: {
      id: 'c3',
      name: 'OralGlow',
      avatar: '/images/avatar3.jpg',
      followers: 5600,
    },
    viewers: 2100,
    likes: 800,
    featuredProduct: {
      id: 'p3',
      title: 'Travel Toothbrush Set',
      price: 12.5,
      image: '/images/product3.jpg',
      description: 'Compact travel set with cover and soft bristles. Perfect for trips.',
      gallery: ['/images/product3.jpg'],
    },
  },
];

