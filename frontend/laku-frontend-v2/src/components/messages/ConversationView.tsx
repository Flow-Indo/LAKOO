'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Store, MoreVertical, Star } from 'lucide-react';
import Image from 'next/image';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { EmptyState } from './EmptyState';
import type { Conversation, Message } from '@/types/message';

// Mock messages data for each conversation
const mockMessagesData: Record<string, Message[]> = {
  '1': [
    {
      id: 'msg1-1',
      senderId: 'user1',
      content: 'Halo! Apakah produk ini masih tersedia?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg1-2',
      senderId: 'current-user',
      content: 'Halo! Ya masih tersedia. Anda berminat?',
      timestamp: new Date(Date.now() - 1000 * 60 * 9), // 9 minutes ago
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg1-3',
      senderId: 'user1',
      content: 'Ya, saya mau pesan. Berapa harganya?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg1-4',
      senderId: 'current-user',
      content: 'Harga Rp 150.000. Pengiriman ke Jakarta ya?',
      timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg1-5',
      senderId: 'user1',
      content: 'Ya betul, ke Jakarta. Bagaimana cara pembayarannya?',
      timestamp: new Date(Date.now() - 1000 * 60 * 1), // 1 minute ago
      isRead: false,
      type: 'text',
    },
  ],
  '2': [
    {
      id: 'msg2-1',
      senderId: 'user2',
      content: 'Terima kasih sudah membeli! Pesanan Anda sudah dikirim.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg2-2',
      senderId: 'current-user',
      content: 'Baik, terima kasih infonya!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: true,
      type: 'text',
    },
  ],
  '3': [
    {
      id: 'msg3-1',
      senderId: 'user3',
      content: 'Bisakah saya lihat detail ukurannya?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg3-2',
      senderId: 'current-user',
      content: 'Tentu! Ukuran S: 90cm, M: 95cm, L: 100cm',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg3-3',
      senderId: 'user3',
      content: 'Kalau XL ada?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg3-4',
      senderId: 'current-user',
      content: 'XL masih ada, ukuran 105cm',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
      isRead: true,
      type: 'text',
    },
  ],
};

interface Props {
  conversation: Conversation | undefined;
  onBack: () => void;
}

export function ConversationView({ conversation, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (conversation) {
      // Load mock messages for this conversation
      const conversationMessages = mockMessagesData[conversation.id] || [];
      setMessages(conversationMessages);
    }
  }, [conversation?.id]);

  const handleSendMessage = (content: string) => {
    if (!conversation || !content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      content: content.trim(),
      timestamp: new Date(),
      isRead: true,
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
  };

  if (!conversation) {
    return <EmptyState />;
  }

  return (
    <div className="h-full flex flex-col bg-white">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>

          <Image
            src={conversation.participant.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(conversation.participant.name)}`}
            alt={conversation.participant.name}
            width={40}
            height={40}
            className="rounded-full"
          />

          <div className="flex-1">
            <h2 className="text-gray-900 font-semibold">{conversation.participant.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(conversation.participant.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {conversation.participant.rating?.toFixed(1)} ({conversation.participant.totalReviews} ulasan)
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {conversation.participant.isOnline ? 'Aktif sekarang' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Store className="w-5 h-5 text-red-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Belum ada pesan. Mulai percakapan!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>

      {/* Message Input */}
      <MessageInput conversationId={conversation.id} onSendMessage={handleSendMessage} />

    </div>
  );
}