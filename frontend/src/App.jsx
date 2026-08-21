import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import SatisfiedClientsSection from './components/SatisfiedClientsSection';
import AboutBookSection from './components/AboutBookSection';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import SEO from './components/SEO';
import { Lock, ShieldCheck } from 'lucide-react';

// Public Storefront Component
const Storefront = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  // Smart Command: Press Ctrl + Shift + A to jump to the Admin Login page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

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
        {/* Hero already includes the Navbar internally */}
        <main>
          <Hero onOpenCart={() => setIsCartOpen(true)} onOpenAdmin={() => navigate('/admin')} />
          <ProductGrid />
          <SatisfiedClientsSection />
          <AboutBookSection />
          <ContactUs />
        </main>
      </div>

      {/* Solid Brown Footer Component */}
      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

// Secure Admin Page wrapper
const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <AdminDashboard onBackToShop={() => navigate('/')} />
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Storefront />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;