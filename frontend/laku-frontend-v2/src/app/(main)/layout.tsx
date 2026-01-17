import { AppLayout } from '@/components/layouts/AppLayout';
import { RightSidebarContent } from '@/components/layouts/RightSidebarContent';

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout
      rightSidebarContent={<RightSidebarContent />}
    >
      {children}
    </AppLayout>
  );
}