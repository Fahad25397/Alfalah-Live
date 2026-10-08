import React, { useState } from 'react';
import { ShoppingBag, Globe, Menu, X } from 'lucide-react';

import { useCart } from '../context/CartContext';

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-[#3c2415] text-[#f4ecd8] py-2 overflow-hidden hover-pause z-[60] relative border-b border-amber-900/50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Decorative elements removed */}
        {/* Marquee container */}
        <div className="w-full flex whitespace-nowrap">
          <div className="animate-marquee inline-block font-medium text-sm tracking-wide px-4">
            🍯 <span className="text-amber-400 font-bold mx-1">Free Delivery All over Pakistan.</span> 
            <span className="mx-8 text-amber-700/50">|</span>
            📞 For any queries: <span className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-bold mx-1 border border-amber-500/30">03331010640</span> and <span className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-bold mx-1 border border-amber-500/30">03334445462</span>
          </div>
          {/* Duplicate for seamless scrolling on wider screens */}
          <div className="animate-marquee inline-block font-medium text-sm tracking-wide px-4" aria-hidden="true">
            🍯 <span className="text-amber-400 font-bold mx-1">Free Delivery All over Pakistan.</span> 
            <span className="mx-8 text-amber-700/50">|</span>
            📞 For any queries: <span className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-bold mx-1 border border-amber-500/30">03331010640</span> and <span className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-bold mx-1 border border-amber-500/30">03334445462</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {

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
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#EDC001]/95 backdrop-blur-md border-b border-amber-400/40 transition-all">
        <AnnouncementBar />
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-16 py-4">

        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <span className="text-xl lg:text-2xl font-serif font-bold text-[#3c2415] tracking-widest">
            Alfalah Honey
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
    </>
  );
};

export default Navbar;