import { ReactNode } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="grid grid-cols-1 md:grid-cols-[72px_1fr] xl:grid-cols-[245px_1fr] h-screen">
        <LeftSidebar />
        <main className="overflow-y-auto bg-white">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}