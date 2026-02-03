 'use client';
 
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Menu, Share, Search, ShoppingCart, Settings, Headset, Inbox, History, Download } from 'lucide-react';
import ScrollText from './ScrollText';
 
 export default function ProfileBio() {
  const router = useRouter();
 
  const handleBack = () => router.back();
 
  const handleSearchClick = () => {
    // navigate to the search page
    router.push('/search');
  };
 
  const handleShare = async () => {
    if (typeof window === 'undefined') return;
 
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wili',
          text: 'Profile Wili',
          url: window.location.href,
        });
      } catch {
        // share cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };
 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'transparent',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div className="flex items-center justify-between mb-[8px]">
        <button
          onClick={openMenu}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        <div className="flex-1 mx-3" />

        <div className="flex items-center gap-2">
          <button
            onClick={handleSearchClick}
            aria-label="Search profile"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors mr-2"
          >
            <Search className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Share className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 h-16">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xl font-bold text-white">W</span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">Willy Dharma</h2>
        </div>
      </div>
      {/* Left-side half-page drawer (always in DOM for smooth transitions) */}
      {typeof window !== 'undefined' &&
        createPortal(
          <>
            <div
              className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              onClick={closeMenu}
              aria-hidden="true"
            />
            <aside
              className={`fixed inset-y-0 left-0 w-1/2 max-w-[80%] bg-transparent z-[60] shadow-xl overflow-auto transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
              role="dialog"
              aria-modal="true"
            >
              <div className="p-6 h-full bg-gray-50 flex flex-col">
                <div className="space-y-6">
                  <div className="rounded-2xl p-4 mt-[5px] mb-[5px]">
                    <div className="flex items-center gap-3">
                      <ScrollText className="w-6 h-6 text-gray-700" />
                      <span className="text-base text-gray-900">Orders</span>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      if (typeof window !== 'undefined') router.push('/cart');
                    }}
                    role="button"
                    className="rounded-2xl p-4 mt-[5px] mb-[5px] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-6 h-6 text-gray-700" />
                      <span className="text-base text-gray-900">Cart</span>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 mt-[5px] mb-[5px]">
                    <div className="flex items-center gap-3">
                      <Headset className="w-6 h-6 text-gray-700" />
                      <span className="text-base text-gray-900">Help Center</span>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 mt-[5px] mb-[5px]">
                    <div className="flex items-center gap-3">
                      <Inbox className="w-6 h-6 text-gray-700" />
                      <span className="text-base text-gray-900">Drafts</span>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 mt-[5px] mb-[5px]">
                    <div className="flex items-center gap-3">
                      <History className="w-6 h-6 text-gray-700" />
                      <span className="text-base text-gray-900">History</span>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 mt-[5px] mb-[5px]">
                    <div className="flex items-center gap-3">
                      <Download className="w-6 h-6 text-gray-700" />
                      <span className="text-base text-gray-900">Downloads</span>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 mt-[5px] mb-[5px]">
                    <div className="flex items-center gap-3">
                      
                    </div>
                  </div>

                  
                </div>

                <div className="mt-auto space-y-2">
                  <div
                    role="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') router.push('/out');
                    }}
                    className="w-full text-center rounded-2xl p-3 border border-gray-200 cursor-pointer"
                  >
                    <span className="text-base text-gray-900">Tukar Akun</span>
                  </div>
                </div>
              </div>
            </aside>
          </>,
          document.body
        )}
    </div>
  );
 }

