import '@/styles/globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Life',
  description: 'System to organize everything I need',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <main className="h-screen flex flex-col justify-center items-center">
        <Navbar />
        {children}
      </main>
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
