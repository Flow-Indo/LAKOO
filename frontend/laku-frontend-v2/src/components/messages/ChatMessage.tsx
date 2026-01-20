import type { Message } from '@/types/message';

interface Props {
  message: Message;
}

export function ChatMessage({ message }: Props) {
  const isOwnMessage = message.senderId === 'current-user'; // TODO: Get from auth context
  const timestamp = new Date(message.timestamp);

  return (
    <div className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? 'bg-red-500 text-white'
              : 'bg-white-50 text-gray-900'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 px-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}