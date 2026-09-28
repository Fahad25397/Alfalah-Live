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
import FloatingSocialIcons from '@/components/FloatingSocialIcons';
import SEO from '@/components/SEO';

const SITE_URL = 'https://alfalahhoney.com';

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
    "@id": `${SITE_URL}/#local-business`,
    "name": "Alfalah Honey",
    "image": `${SITE_URL}/logo.png`,
    "url": SITE_URL,
    "telephone": "+923331010640",
    "email": "alfalahhoney2@gmail.com",
    "description": "Pakistan's trusted store for 100% pure Sidr honey, Ajwa & Medjool dates, Zamzam water, cold-pressed olive oil, desi ghee, saffron, shilajit & premium dry fruits. Established 1990 in Peshawar.",
    "priceRange": "$$",
    "currenciesAccepted": "PKR",
    "paymentAccepted": "Cash on Delivery",
    "foundingDate": "1990",
    "founder": {
      "@type": "Person",
      "name": "Haji Hafeezullah (Gull and Son's)"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Opposite to Salman Bakers near Soft Swirl, Gulbahar",
      "addressLocality": "Peshawar",
      "addressRegion": "Khyber Pakhtunkhwa",
      "postalCode": "25000",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 34.0151,
      "longitude": 71.5249
    },
    "areaServed": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "sameAs": [
      "https://www.instagram.com/alfalah_honey_gulbahar",
      "https://www.facebook.com/share/1M7PpHWra6/"
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "22:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200000",
      "bestRating": "5"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": "Alfalah Honey",
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/logo.png`,
      "width": 512,
      "height": 512
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+923331010640",
      "contactType": "customer service",
      "email": "alfalahhoney2@gmail.com",
      "areaServed": "PK",
      "availableLanguage": ["English", "Urdu"]
    },
    "sameAs": [
      "https://www.instagram.com/alfalah_honey_gulbahar",
      "https://www.facebook.com/share/1M7PpHWra6/"
    ]
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "name": "Alfalah Honey",
    "url": SITE_URL,
    "description": "Premium organic honey, dates, Zamzam water & natural wellness products. Cash on delivery across Pakistan.",
    "publisher": { "@id": `${SITE_URL}/#organization` },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#3c2415] relative flex flex-col justify-between">
      <SEO 
        title="Alfalah Honey — Buy Pure Sidr Honey, Organic Dates & Zamzam Water Online in Pakistan"
        description="Pakistan's trusted store for 100% pure Sidr honey, Ajwa & Medjool dates, Zamzam water, cold-pressed olive oil, desi ghee, saffron, shilajit & premium dry fruits. Cash on delivery nationwide."
        url={SITE_URL}
        image={`${SITE_URL}/logo.png`}
        schema={[localBusinessSchema, organizationSchema, webSiteSchema, breadcrumbSchema]}
      />
      <main>
        <Hero onOpenCart={() => setIsCartOpen(true)} onOpenAdmin={() => router.push('/admin')} />
        <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
          <ProductGrid />
        </Suspense>
        <SatisfiedClientsSection />
        <AboutBookSection />
        <ContactUs />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      
      <FloatingSocialIcons />
    </div>
  );
}

