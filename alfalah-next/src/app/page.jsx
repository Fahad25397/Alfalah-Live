"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import SatisfiedClientsSection from '@/components/SatisfiedClientsSection';
import AboutBookSection from '@/components/AboutBookSection';
import ContactUs from '@/components/ContactUs';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import SEO from '@/components/SEO';

export default function Storefront() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault();
        router.push('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Alfalah Store",
    "image": "https://alfalah-store.vercel.app/logo.png",
    "url": "https://alfalah-store.vercel.app/",
    "telephone": "+923000000000",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lahore",
      "addressCountry": "PK"
    },
    "description": "Premium organic products including pure Sidr Honey, Dates, Zamzam water, and more.",
    "priceRange": "$$"
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#3c2415] relative flex flex-col justify-between">
      <SEO 
        title="Alfalah - Premium Organic Honey & Natural Products"
        description="Shop pure Sidr Honey, Zamzam water, premium dates, and organic natural products. Experience authenticity and quality at Alfalah."
        url="https://alfalah-store.vercel.app/"
        schema={localBusinessSchema}
      />
      <div>
        <main>
          <Hero onOpenCart={() => setIsCartOpen(true)} onOpenAdmin={() => router.push('/admin')} />
          <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
            <ProductGrid />
          </Suspense>
          <SatisfiedClientsSection />
          <AboutBookSection />
          <ContactUs />
        </main>
      </div>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      
      <WhatsAppIcon />
    </div>
  );
}
