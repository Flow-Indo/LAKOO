'use client';

import { useState } from 'react';
import { Send, Image as ImageIcon, Smile, Package, Camera, FileText, MapPin, CreditCard, Phone } from 'lucide-react';

interface Props {
  conversationId: string;
  onSendMessage: (content: string) => void;
}

export function MessageInput({ conversationId, onSendMessage }: Props) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;

    onSendMessage(message.trim());
    setMessage('');
  };

  const handleAttachment = (type: string) => {
    console.log(`Attachment clicked: ${type}`);
    // TODO: Implement attachment functionality
  };

  return (
    <div className="border-t border-gray-200">
      {/* Attachment Options */}
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-4 overflow-x-auto">
          <button
            onClick={() => handleAttachment('product')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
          >
            <Package className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Produk</span>
          </button>

          <button
            onClick={() => handleAttachment('camera')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
          >
            <Camera className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Kamera</span>
          </button>

          <button
            onClick={() => handleAttachment('image')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
          >
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Galeri</span>
          </button>

          <button
            onClick={() => handleAttachment('order')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
          >
            <CreditCard className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Pesanan</span>
          </button>

          <button
            onClick={() => handleAttachment('document')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
          >
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Dokumen</span>
          </button>

          <button
            onClick={() => handleAttachment('location')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
          >
            <MapPin className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Lokasi</span>
          </button>

          <button
            onClick={() => handleAttachment('whatsapp')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
          >
            <Phone className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">WhatsApp</span>
          </button>

          <button
            onClick={() => handleAttachment('support')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
          >
            <Package className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600">Bantuan</span>
          </button>
        </div>
      </div>

      {/* Message Input */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-5 py-3">
          <button className="flex-shrink-0 hover:opacity-70 transition">
            <Smile className="w-6 h-6 text-gray-400" />
          </button>

          <input
            type="text"
            placeholder="Ketik pesan..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
          />

          <button className="flex-shrink-0 hover:opacity-70 transition">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </button>

          {message.trim() && (
            <button
            onClick={handleSend}
            className="flex-shrink-0 text-red-500 font-semibold hover:text-red-600 transition"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}