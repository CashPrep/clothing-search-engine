import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clothing Search Engine',
  description: 'Search products across retailers with coupons and direct links.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
