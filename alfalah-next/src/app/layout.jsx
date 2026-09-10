import { CartProvider } from '@/context/CartContext';
import '@/app/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = 'https://alfalah-store.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Alfalah Honey — Buy Pure Sidr Honey, Organic Dates & Zamzam Water Online in Pakistan',
    template: '%s | Alfalah Honey — Premium Organic Products',
  },
  description:
    'Pakistan\'s trusted store for 100% pure Sidr honey, Ajwa & Medjool dates, Zamzam water, cold-pressed olive oil, desi ghee, saffron, shilajit & premium dry fruits. Cash on delivery nationwide. Established 1990.',
  keywords: [
    'pure sidr honey Pakistan',
    'organic honey online',
    'Ajwa dates Madinah',
    'Zamzam water Pakistan',
    'cold pressed olive oil',
    'desi ghee organic',
    'premium dry fruits',
    'saffron Pakistan',
    'shilajit Himalayan',
    'Alfalah Honey Peshawar',
    'natural wellness products Pakistan',
  ],
  authors: [{ name: 'Alfalah Honey', url: SITE_URL }],
  creator: 'Muhammad Fahad Khan',
  publisher: 'Alfalah Honey',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Alfalah Honey',
    title: 'Alfalah Honey — Buy Pure Sidr Honey, Organic Dates & Zamzam Water Online',
    description:
      'Shop 100% pure Sidr honey, Ajwa dates, Zamzam water, olive oil, desi ghee, saffron, shilajit & dry fruits. Cash on delivery across Pakistan.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Alfalah Honey — Premium Organic Honey & Natural Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alfalah Honey — Premium Organic Honey & Natural Products',
    description:
      'Pakistan\'s trusted source for pure Sidr honey, Ajwa dates, Zamzam water & organic wellness products. COD nationwide.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'theme-color': '#3c2415',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3c2415',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
