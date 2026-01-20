export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
  rating?: number; // Seller rating (1-5)
  totalReviews?: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'product';
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
  isPinned?: boolean;
}