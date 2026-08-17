import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
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

// Secure Admin Page Component with Password Protection
const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const ADMIN_PASSWORD = "00966552282515"; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1e1713] text-amber-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#2a1d17] p-8 rounded-3xl border border-amber-900/40 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Admin Restricted Area</h1>
            <p className="text-amber-200/70 text-sm">Please enter your password to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-amber-900/60 text-white placeholder-amber-200/30 focus:outline-none focus:border-amber-500 transition"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-xs mt-2 pl-1">Incorrect password. Access denied.</p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#eab308] hover:bg-[#d97706] text-amber-950 font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck size={18} />
              <span>Authenticate</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button 
              onClick={() => navigate('/')}
              className="text-xs text-amber-300/60 hover:text-amber-300 transition cursor-pointer"
            >
              &larr; Back to storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

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