'use client';

import { ReactNode } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  rightSidebarContent?: ReactNode;
  hideRightSidebar?: boolean;
}

export function AppLayout({
  children,
  rightSidebarContent,
  hideRightSidebar = false,
}: AppLayoutProps) {
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] lg:grid-cols-[256px_1fr_320px] h-screen app-container max-w-[1920px] mx-auto">
        {/* Left Sidebar - Fixed 256px, appears at 768px+ */}
        <div className="hidden md:block md:col-start-1 sticky top-0 h-screen overflow-y-auto">
          <LeftSidebar />
        </div>

        {/* Center Column - Always shows children */}
        <div className="center-column col-start-1 md:col-start-2 lg:col-start-2 h-screen overflow-y-auto bg-white">
          {children}
        </div>

        {/* Right Sidebar - Fixed 320px, appears at 1024px+ */}
        {!hideRightSidebar && (
          <div className="hidden lg:block lg:col-start-3 sticky top-0 h-screen overflow-y-auto">
            {rightSidebarContent && (
              <RightSidebar>
                {rightSidebarContent}
              </RightSidebar>
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}