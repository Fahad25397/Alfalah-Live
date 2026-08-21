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

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#3c2415] relative flex flex-col justify-between">
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