import React, { useState } from 'react';
import { ShoppingBag, Globe, Menu, X } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { currentCurrency, setCurrentCurrency, currencies } = useCurrency();
  const { setIsCartOpen, totalItems } = useCart();

  // State to track which navigation pill is currently active
  const [activeTab, setActiveTab] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'Shop', href: '#products' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Return Policy', href: '#return-policy' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#EDC001]/95 backdrop-blur-md border-b border-amber-400/40 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-16 py-4">

        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <span className="text-xl lg:text-2xl font-serif font-bold text-[#3c2415] tracking-widest">
            ALFALAH
          </span>
        </div>

        {/* Center Pill Navigation Container with Fluid Liquid Slide Transition (Desktop Only) */}
        <nav className="hidden md:flex items-center bg-[#f7d648] border border-amber-400/60 rounded-full p-1.5 shadow-sm relative">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveTab(item.name)}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-500 ${isActive
                  ? 'text-[#f4ecd8]'
                  : 'text-[#3c2415]/90 hover:text-[#3c2415]'
                  }`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-[#3c2415] rounded-full -z-10 shadow-md transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] animate-in fade-in zoom-in-95" />
                )}
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Right Actions - Currency Dropdown, Cart Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Currency Selector (Always Visible on all screen sizes) */}
          <div className="flex items-center gap-1.5 bg-[#f7d648]/80 border border-amber-400/60 px-2.5 sm:px-3 py-2 rounded-full text-xs font-medium text-[#3c2415] shadow-xs backdrop-blur-sm">
            <Globe size={13} className="text-[#3c2415]/70 flex-shrink-0" />
            <select
              value={currentCurrency}
              onChange={(e) => setCurrentCurrency(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-medium text-[#3c2415]"
            >
              {Object.keys(currencies).map((code) => (
                <option key={code} value={code} className="bg-[#EDC001] text-[#3c2415]">
                  {code} ({currencies[code].symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-full bg-[#3c2415]/95 hover:bg-[#3c2415] text-[#f4ecd8] font-medium transition cursor-pointer shadow-md text-xs active:scale-95 backdrop-blur-sm relative"
          >
            <div className="relative">
              <ShoppingBag size={15} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-amber-500 text-[#3c2415] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2.5 rounded-full bg-[#f7d648] text-[#3c2415] border border-amber-400/60 shadow-xs focus:outline-none cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Navigation Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#EDC001] border-b border-amber-400/60 shadow-xl py-6 px-6 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col gap-2.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-5 py-3 rounded-xl text-sm font-medium transition ${isActive
                    ? 'bg-[#3c2415] text-[#f4ecd8] shadow-sm'
                    : 'bg-[#f7d648] text-[#3c2415] shadow-xs hover:bg-[#f5eaba]'
                    }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;