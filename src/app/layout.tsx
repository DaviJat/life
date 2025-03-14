import '../styles/globals.css';

import type { Metadata } from 'next';
import { Inter as InterFont } from 'next/font/google';

import Provider from '@/components/providers/Provider';
import { Toaster } from '@/components/ui/toaster';

const inter = InterFont({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Life',
  description: 'System to organize everything I need',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <Provider>
        <main className="bg-background">{children}</main>
        <Toaster />
      </Provider>
    </body>
  </html>
);

export default RootLayout;
