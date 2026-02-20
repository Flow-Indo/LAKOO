import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { AppProvider } from '@/providers';
import { DevAuthProvider } from '@/providers/DevAuthProvider';
import { BottomNavProvider } from '@/components/layouts/BottomNavContext';
import { Toaster } from 'sonner';
import { Inter } from 'next/font/google';

// Inter - modern sans-serif similar to Plus Jakarta Sans
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LAKU - Marketplace Indonesia',
  description: 'Platform belanja online dengan fitur group buying',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
  other: {
    'apple-mobile-web-app-status-bar-style': 'black',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className={`${inter.className} bg-white antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-white rounded">
          Skip to main content
        </a>
        <div className="bg-white min-h-screen w-full">
          <LanguageProvider>
            <ChatProvider>
              <DevAuthProvider>
                <AppProvider>
                  <BottomNavProvider>
                    {children}
                    <Toaster position="top-center" />
                  </BottomNavProvider>
                </AppProvider>
              </DevAuthProvider>
            </ChatProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
