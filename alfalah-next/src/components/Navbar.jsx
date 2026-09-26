"use client";
import React, { useState } from 'react';
import { ShoppingBag, Globe, Menu, X } from 'lucide-react';

import { useCart } from '../context/CartContext';

const AnnouncementBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#3c2415] overflow-hidden h-8 sm:h-9 flex items-center">
      <div className="announcement-marquee whitespace-nowrap flex items-center gap-16">
        {/* Duplicate the content several times for a seamless loop */}
        {[...Array(6)].map((_, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[#f4ecd8] text-xs sm:text-sm font-medium tracking-wide px-8">
            🚚 <span className="text-amber-400 font-semibold">FREE Delivery Nationwide </span> on orders above <span className="text-amber-400 font-bold">Rs. 10,000!</span>
            <span className="mx-4 text-amber-600">✦</span>
            🎁 Premium Quality Guaranteed
            <span className="mx-4 text-amber-600">✦</span>
            📦 Cash on Delivery Available Nationwide
            <span className="mx-4 text-amber-600">✦</span>
          </span>
        ))}
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
      {/* Scrolling Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar – pushed down below the announcement bar */}
      <header className="fixed top-8 sm:top-9 left-0 right-0 z-50 bg-[#EDC001]/95 backdrop-blur-md border-b border-amber-400/40 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-16 py-4">

          {/* Brand Title */}
          <div className="flex items-center gap-3">
            <a href="#hero" className="text-xl lg:text-2xl font-serif font-bold text-[#3c2415] tracking-widest">
              Alfalah Honey
            </a>
          </div>

          {/* Center Pill Navigation Container with Fluid Liquid Slide Transition (Desktop Only) */}
          <nav className="hidden md:flex items-center bg-[#f7d648] border border-amber-400/60 rounded-full p-1.5 shadow-sm relative" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveTab(item.name)}
                  aria-current={isActive ? 'page' : undefined}
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
              aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} item${totalItems > 1 ? 's' : ''}` : ', empty'}`}
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
            <nav className="flex flex-col gap-2.5" aria-label="Mobile Navigation">
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
                    aria-current={isActive ? 'page' : undefined}
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
