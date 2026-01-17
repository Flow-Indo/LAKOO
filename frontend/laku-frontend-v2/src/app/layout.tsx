import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppProvider } from '@/providers';
import { DevAuthProvider } from '@/providers/DevAuthProvider';
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
      <body className={`${inter.className} bg-white`}>
        <div className="bg-white min-h-screen w-full">
          <LanguageProvider>
            <DevAuthProvider>
              <AppProvider>
                {children}
                <Toaster position="top-center" />
              </AppProvider>
            </DevAuthProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
