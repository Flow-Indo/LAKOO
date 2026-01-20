'use client';

import { useState, useEffect } from 'react';
import { MessagesList } from './MessagesList';
import { ConversationView } from './ConversationView';
import { cn } from '@/lib/utils';
import { useChat } from '@/contexts/ChatContext';
import type { Conversation } from '@/types/message';

interface Props {
  initialConversations: Conversation[];
}

export function MessagesPageClient({ initialConversations }: Props) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const { setIsInChat } = useChat();

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  useEffect(() => {
    // Update chat context when conversation selection changes
    setIsInChat(!!selectedConversationId);
  }, [selectedConversationId, setIsInChat]);

  const handleConversationSelect = (id: string) => {
    setSelectedConversationId(id);
    setIsMobileView(true);
  };

  const handleBack = () => {
    setSelectedConversationId(null);
    setIsMobileView(false);
  };

  return (
    <div className="h-screen bg-white flex">

      {/* Messages List - Left Panel */}
      <div className={cn(
        "w-full md:w-[320px] border-r border-gray-200 flex-shrink-0 px-6 md:px-8 xl:px-8",
        isMobileView && selectedConversationId ? "hidden md:block" : "block"
      )}>
        <MessagesList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={handleConversationSelect}
        />
      </div>

      {/* Conversation View - Right Panel */}
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobileView && !selectedConversationId ? "hidden md:flex" : "flex"
      )}>
        <ConversationView
          conversation={selectedConversation}
          onBack={handleBack}
        />
      </div>

    </div>
  );
}