'use client';

import { Search, Edit } from 'lucide-react';
import { MessageItem } from './MessageItem';
import type { Conversation } from '@/types/message';

interface Props {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MessagesList({ conversations, selectedId, onSelect }: Props) {
  return (
    <div className="h-full flex flex-col bg-white">

      {/* Header */}
      <div className="py-10 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pesan</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Edit className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pesan"
            className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 pl-12 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <MessageItem
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedId}
            onClick={() => onSelect(conversation.id)}
          />
        ))}
      </div>

    </div>
  );
}