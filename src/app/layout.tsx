import type { Metadata, Viewport } from 'next';
import { SerwistProvider } from '@serwist/turbopack/react';
import './globals.css';
import { Header } from '@/components/Header';
import { BottomPlayer } from '@/components/BottomPlayer';

export const metadata: Metadata = {
  title: 'Quran Audio',
  description: 'Listen to Qur\'an audio recordings',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Quran Audio',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#121418',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className="flex min-h-full flex-col bg-base text-primary">
        <SerwistProvider swUrl="/serwist/sw.js">
          <Header />
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 pb-28">
            {children}
          </main>
          <BottomPlayer />
        </SerwistProvider>
      </body>
    </html>
  );
}
