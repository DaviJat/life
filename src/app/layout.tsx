import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life',
  description: 'Sistema para organizar tudo que eu precisar',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <body>{children}</body>
);

export default RootLayout;
