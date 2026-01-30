'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Video, Plus, ShoppingCart, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock cart count - replace with real cart state
  const cartItemCount = 3;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around h-16 px-2">
          {/* Beranda */}
          <Link
            href="/explore"
            className="flex flex-col items-center gap-1 flex-1"
          >
            <Home
              className={`w-6 h-6 ${
                pathname === '/explore' || pathname === '/'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            />
            <span className="text-xs text-gray-600">Beranda</span>
          </Link>

          {/* Video */}
          <Link
            href="/video"
            className="flex flex-col items-center gap-1 flex-1"
          >
            <Video
              className={`w-6 h-6 ${
                pathname === '/video' ? 'text-gray-900' : 'text-gray-500'
              }`}
            />
            <span className="text-xs text-gray-600">Video</span>
          </Link>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* Cart - CHANGED FROM MESSAGES */}
          <Link
            href="/cart"
            className="flex flex-col items-center gap-1 flex-1 relative"
          >
            <ShoppingCart
              className={`w-6 h-6 ${
                pathname === '/cart' ? 'text-gray-900' : 'text-gray-500'
              }`}
            />
            <span className="text-xs text-gray-600">Keranjang</span>
            {/* Cart Badge */}
            {cartItemCount > 0 && (
              <div className="absolute top-0 right-6 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{cartItemCount}</span>
              </div>
            )}
          </Link>

          {/* Me */}
          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 flex-1"
          >
            <User
              className={`w-6 h-6 ${
                pathname === '/profile' ? 'text-gray-900' : 'text-gray-500'
              }`}
            />
            <span className="text-xs text-gray-600">Me</span>
          </Link>
        </div>
      </nav>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}

function CreateModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full bg-white rounded-t-2xl p-4 pb-8">
        <div className="space-y-3">
          <button className="w-full py-4 text-left text-base text-gray-500 font-medium">
            Choose from album
          </button>
          <button className="w-full py-4 text-left text-base text-gray-500 font-medium">
            Camera
          </button>
          <button className="w-full py-4 text-left text-base text-gray-500 font-medium">
            Go Live
          </button>
          <button className="w-full py-4 text-left text-base text-gray-500 font-medium">
            Text
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 text-center text-base font-medium text-gray-500 border-t"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default BottomNav;
