'use client';

import { UserProfileCard } from './sidebars/UserProfileCard';
import { MiniCart } from './sidebars/MiniCart';
import { WhatsAppButton } from './sidebars/WhatsAppButton';

export function RightSidebar({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="w-80 h-screen overflow-y-auto bg-white sticky top-0 shadow-lg hidden lg:block">
      <div className="p-4 space-y-4">
        {/* User Profile Card - always on top */}
        <UserProfileCard />

        {/* Custom content from page (optional) */}
        {children}

        {/* Default widgets if no children */}
        {!children && (
          <>
            <MiniCart />
            <WhatsAppButton />
          </>
        )}
      </div>
    </aside>
  );
}