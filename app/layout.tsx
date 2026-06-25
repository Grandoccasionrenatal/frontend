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
  title: 'Party & Event Rentals in Kildare, Dublin & Carlow | Grand Occasion Rentals',
  description:
    'Hire marquees, chairs, tables, bouncy castles, flower walls & more across Kildare, Dublin, Carlow and Portlaoise. Hassle-free delivery. 500+ items available. Book today!',
  keywords: [
    'party rental Ireland',
    'event hire Kildare',
    'marquee hire Dublin',
    'chair hire Carlow',
    'table hire Portlaoise',
    'bouncy castle hire',
    'flower wall hire',
    'wedding rental Ireland',
    'kids party equipment hire'
  ],
  verification: { google: '_TKD4HUsF_AuvifO8Z4oKsY_753O8nEyi5wTaA2labg' },
  alternates: {
    canonical: 'https://www.grandoccasionrental.ie'
  },
  openGraph: {
    title: 'Grand Occasion Rentals — Party & Event Hire in Kildare, Dublin & Carlow',
    description:
      '500+ party & event hire items. Marquees, tables, chairs, bouncy castles & more. Delivered to your door across Leinster.',
    url: 'https://www.grandoccasionrental.ie',
    siteName: 'Grand Occasion Rentals',
    type: 'website',
    locale: 'en_IE'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grand Occasion Rentals — Party & Event Hire in Kildare, Dublin & Carlow',
    description:
      '500+ party & event hire items delivered to your door across Kildare, Dublin & Carlow.'
  }
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Grand Occasion Rentals',
              url: 'https://www.grandoccasionrental.ie',
              description:
                'Party and event equipment rental service offering marquees, chairs, tables, bouncy castles, flower walls, and more across Kildare, Dublin, Carlow and Portlaoise.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kildare',
                addressRegion: 'Leinster',
                addressCountry: 'IE'
              },
              areaServed: [
                { '@type': 'City', name: 'Kildare' },
                { '@type': 'City', name: 'Dublin' },
                { '@type': 'City', name: 'Carlow' },
                { '@type': 'City', name: 'Portlaoise' }
              ],
              priceRange: '€€'
            })
          }}
        />
      </body>
    </html>
  );
}
