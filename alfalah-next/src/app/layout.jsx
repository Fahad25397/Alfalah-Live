import { CartProvider } from '@/context/CartContext';
import '@/app/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Alfalah - Premium Organic Honey & Natural Products',
  description: 'Shop pure Sidr Honey, Zamzam water, premium dates, and organic natural products. Experience authenticity and quality at Alfalah.',
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
