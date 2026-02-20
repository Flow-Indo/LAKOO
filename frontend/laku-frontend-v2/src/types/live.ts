export interface LiveVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds

  // Creator info
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
    isFollowing: boolean;
  };

  // Content
  caption: string;
  hashtags: string[];
  mentions: string[];

  // Audio
  audio: {
    name: string;
    artist: string;
    coverUrl?: string;
  };

  // Engagement
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;

  // User interaction state
  isLiked: boolean;
  isSaved: boolean;

  // Meta
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: Date;
  replies?: Comment[];
}