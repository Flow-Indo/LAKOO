import type { LiveVideo } from '@/types/live';

export const mockLiveVideos: LiveVideo[] = [
  {
    id: '1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-clothing-in-a-urban-setting-4687-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=700&fit=crop',
    duration: 15,

    creator: {
      id: 'creator1',
      username: 'fashionista',
      displayName: 'Fashionista',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isVerified: true,
      isFollowing: false,
    },

    caption: 'Check out this amazing fashion haul! Loving these new pieces from the latest collection. What do you think? #fashion #style #outfit',
    hashtags: ['fashion', 'style', 'outfit'],
    mentions: [],

    audio: {
      name: 'Trendy Vibes',
      artist: 'Fashion Music',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    },

    likes: 12543,
    comments: 234,
    shares: 89,
    saves: 456,
    views: 45678,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-with-headphones-on-4685-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=700&fit=crop',
    duration: 20,

    creator: {
      id: 'creator2',
      username: 'dancequeen',
      displayName: 'Dance Queen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isVerified: false,
      isFollowing: true,
    },

    caption: 'Dancing to my favorite beats! This song has been on repeat all week. Who else is obsessed with this track? 🎵💃',
    hashtags: ['dance', 'music', 'beats'],
    mentions: [],

    audio: {
      name: 'Groove Master',
      artist: 'DJ Beats',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    },

    likes: 8921,
    comments: 156,
    shares: 67,
    saves: 234,
    views: 32145,
    isLiked: true,
    isSaved: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-a-delicious-meal-in-the-kitchen-4681-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=700&fit=crop',
    duration: 18,

    creator: {
      id: 'creator3',
      username: 'chefmaster',
      displayName: 'Chef Master',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isVerified: true,
      isFollowing: false,
    },

    caption: 'Whipping up something delicious in the kitchen! This pasta recipe is a must-try. Recipe in comments 👨‍🍳🍝 #cooking #foodie #pasta',
    hashtags: ['cooking', 'foodie', 'pasta'],
    mentions: [],

    audio: {
      name: 'Kitchen Beats',
      artist: 'Cooking Sounds',
      coverUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
    },

    likes: 15678,
    comments: 345,
    shares: 123,
    saves: 678,
    views: 56789,
    isLiked: false,
    isSaved: true,
    createdAt: new Date(),
  },
];