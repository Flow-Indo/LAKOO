import { MessagesPageClient } from '@/components/messages/MessagesPageClient';
import type { Conversation } from '@/types/message';

// Mock data for development
const mockConversations: Conversation[] = [
  {
    id: '1',
    participant: {
      id: 'user1',
      name: 'Toko Fashion Sarah',
      username: 'sarah_fashion',
      avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop',
      isOnline: true,
      rating: 4.8,
      totalReviews: 156,
    },
    lastMessage: {
      id: 'msg1',
      senderId: 'user1',
      content: 'Halo! Apakah produk ini masih tersedia?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: false,
      type: 'text',
    },
    unreadCount: 2,
  },
  {
    id: '2',
    participant: {
      id: 'user2',
      name: 'Butik Elegan',
      username: 'butik_elegan',
      avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop',
      isOnline: false,
      rating: 4.9,
      totalReviews: 2034,
    },
    lastMessage: {
      id: 'msg2',
      senderId: 'user2',
      content: 'Terima kasih sudah membeli! Pesanan Anda sudah dikirim.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: true,
      type: 'text',
    },
    unreadCount: 0,
  },
  {
    id: '3',
    participant: {
      id: 'user3',
      name: 'Mode Modern Store',
      username: 'mode_modern',
      avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop',
      isOnline: true,
      rating: 4.6,
      totalReviews: 89,
    },
    lastMessage: {
      id: 'msg3',
      senderId: 'user3',
      content: 'Bisakah saya lihat detail ukurannya?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: false,
      type: 'text',
    },
    unreadCount: 1,
  },
];

export default async function MessagesPage() {
  // TODO: Replace with real API call
  // const conversations: Conversation[] = await fetch('http://localhost:3000/api/messages/conversations', {
  //   next: { revalidate: 30 }
  // }).then(r => r.json()).catch(() => []);

  // For now, use mock data
  const conversations = mockConversations;

  return <MessagesPageClient initialConversations={conversations} />;
}