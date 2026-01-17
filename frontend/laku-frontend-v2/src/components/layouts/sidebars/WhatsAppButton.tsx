'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  // Indonesian business WhatsApp number (placeholder - replace with actual number)
  const whatsappNumber = '6281234567890';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Halo%20LAKU,%20saya%20ingin%20bertanya%20tentang%20produk%20Anda`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden xl:flex fixed bottom-6 right-6 z-50 items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors duration-200 group"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Chat via WhatsApp
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
      </div>
    </Link>
  );
}