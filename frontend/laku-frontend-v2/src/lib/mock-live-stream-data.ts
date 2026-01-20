import type { LiveStream, LiveViewer, MockComment, MockGift } from '@/types/live-stream';

// Mock viewers
export const mockViewers: LiveViewer[] = [
  { id: '1', username: 'alice_design', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop', isVerified: true },
  { id: '2', username: 'bob_tech', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop' },
  { id: '3', username: 'charlie_art', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop' },
  { id: '4', username: 'diana_fashion', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop', isVerified: true },
  { id: '5', username: 'eve_music', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop' },
  { id: '6', username: 'frank_food', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop' },
  { id: '7', username: 'grace_sports', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop' },
  { id: '8', username: 'henry_travel', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop' },
];

// Mock comments for simulation
export const mockComments: MockComment[] = [
  { user: 'alice_design', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop', text: 'Love this dress! Where can I buy it?' },
  { user: 'bob_tech', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop', text: 'Great quality! How much is shipping?' },
  { user: 'charlie_art', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop', text: 'This is exactly what I was looking for!' },
  { user: 'diana_fashion', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop', text: 'Perfect fit for my style 😍' },
  { user: 'eve_music', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop', text: 'Do you have this in different colors?' },
  { user: 'frank_food', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop', text: 'Amazing craftsmanship!' },
  { user: 'grace_sports', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop', text: 'How long does shipping take?' },
  { user: 'henry_travel', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop', text: 'This would look great in my collection!' },
];

// Mock join notifications
export const mockJoins: MockComment[] = [
  { user: 'sarah_style', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=32&h=32&fit=crop', text: 'joined the live stream', type: 'join' },
  { user: 'mike_cool', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop', text: 'joined via share invitation', type: 'join' },
  { user: 'lisa_art', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop', text: 'joined the live stream', type: 'join' },
];

// Mock gifts
export const mockGifts: MockGift[] = [
  { name: 'Rose', icon: '🌹', value: 5 },
  { name: 'Heart', icon: '❤️', value: 10 },
  { name: 'Gift Box', icon: '🎁', value: 25 },
  { name: 'Diamond', icon: '💎', value: 50 },
  { name: 'Crown', icon: '👑', value: 100 },
];

// Current live stream data
export const currentLiveStream: LiveStream = {
  id: 'live-001',
  seller: {
    id: 'seller-001',
    name: 'Fashion Forward',
    username: 'fashionforward',
    avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=60&h=60&fit=crop',
    isVerified: true,
    isFollowing: false,
  },
  title: 'Summer Collection Launch - Live Shopping!',
  description: 'Join me for the exclusive launch of our summer fashion collection! Special live-only discounts and styling tips.',
  viewerCount: 1247,
  likeCount: 892,
  isLive: true,
  currentProduct: {
    id: 'prod-live-001',
    name: 'Elegant Summer Maxi Dress',
    description: 'Beautiful floral print maxi dress perfect for summer occasions',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=120&h=120&fit=crop',
    price: 299000,
    originalPrice: 399000,
    discount: 25,
    inStock: true,
    cardNumber: 1,
  },
  products: [
    {
      id: 'prod-live-001',
      name: 'Elegant Summer Maxi Dress',
      description: 'Beautiful floral print maxi dress perfect for summer occasions',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=120&h=120&fit=crop',
      price: 299000,
      originalPrice: 399000,
      discount: 25,
      inStock: true,
      cardNumber: 1,
    },
    {
      id: 'prod-live-002',
      name: 'Designer Sunglasses',
      description: 'Stylish UV protection sunglasses',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=120&h=120&fit=crop',
      price: 450000,
      inStock: true,
      cardNumber: 2,
    },
  ],
  viewers: mockViewers.slice(0, 8), // Show first 8 viewers
  comments: [], // Will be populated by simulation
  startedAt: new Date(Date.now() - 1800000), // Started 30 minutes ago
};