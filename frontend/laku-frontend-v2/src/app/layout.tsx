import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/providers';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LAKU - Marketplace Indonesia',
  description: 'Platform belanja online dengan fitur group buying',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AppProvider>
          {children}
          <Toaster position="top-center" />
        </AppProvider>
      </body>
    </html>
  );
}
