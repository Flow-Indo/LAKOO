'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/message';

interface Props {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export function MessageItem({ conversation, isSelected, onClick }: Props) {
  const { participant, lastMessage, unreadCount } = conversation;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors",
        isSelected && "bg-white-50"
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Image
          src={participant.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(participant.name)}`}
          alt={participant.name}
          width={56}
          height={56}
          className="rounded-full"
        />
        {participant.isOnline && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            "font-semibold truncate",
            unreadCount > 0 ? "text-gray-900" : "text-gray-900"
          )}>
            {participant.name}
          </span>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {formatMessageTime(lastMessage.timestamp)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className={cn(
            "text-sm truncate",
            unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"
          )}>
            {lastMessage.content}
          </p>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full flex-shrink-0">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function formatMessageTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString();
}