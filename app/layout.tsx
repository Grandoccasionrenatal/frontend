import Providers from '@/components/hocs/Providers/indesx';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const giliran = localFont({
  src: '../assets/font/Giliran-Regular.ttf',
  display: 'swap',
  variable: '--font-giliran'
});

export const metadata: Metadata = {
  title: 'Grand Occasion Rentals',
  description: 'Find equipments, furniture, tools and items for our events and occasions',
  keywords: ['rental', 'event', 'occasion', 'wedding', 'ceremony', 'chair', 'table', 'playground'],
  verification: { google: '_TKD4HUsF_AuvifO8Z4oKsY_753O8nEyi5wTaA2labg' }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter?.variable}  ${giliran?.variable}  text-black-1`}>
        <NextTopLoader
          color="#FF9E00"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FFD60A,0 0 5px #FFD60A"
        />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
