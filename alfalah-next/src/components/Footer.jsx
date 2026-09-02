"use client";
import React from 'react';
import { Mail, Phone, MapPin, ArrowUp, Code } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#3c2415] text-[#f4ecd8] pt-16 pb-12 px-6 lg:px-16 border-t border-amber-900/40">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        {/* Brand & About */}
        <div className="space-y-4">
          <span className="text-2xl font-serif font-bold text-white tracking-widest block">
            Alfalah Honey
          </span>
          <p className="text-[#f4ecd8]/70 text-xs font-light leading-relaxed">
            Your trusted source for pure, organic honey, premium dates, traditional desi ghee, and wholesome wellness staples crafted to nourish your daily life.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-amber-200">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs font-light">
            <li>
              <a href="#hero" className="hover:text-white transition">Home</a>
            </li>
            <li>
              <a href="#products" className="hover:text-white transition">Shop Collections</a>
            </li>
            <li>
              <a href="#about" className="hover:text-white transition">About Us</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-amber-200">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-xs font-light">
            <li className="flex items-center gap-2.5 text-[#f4ecd8]/80">
              <MapPin size={15} className="text-amber-300 flex-shrink-0" />
              <span>Alfalah Honey Opposite to Salman Bakers near Sweet Cream , Gulabahr,Peshawar</span>
            </li>
            <li className="flex items-center gap-2.5 text-[#f4ecd8]/80">
              <Phone size={15} className="text-amber-300 flex-shrink-0" />
              <span dir="ltr">03334445462</span>
            </li>
            <li className="flex items-center gap-2.5 text-[#f4ecd8]/80">
              <Mail size={15} className="text-amber-300 flex-shrink-0" />
              <span>alfalahhoney2@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Developer Info & Socials */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-amber-200">
            Developer Info
          </h4>
          <p className="text-[#f4ecd8]/70 text-xs font-light">
            Developed by Muhammad Fahad Khan.For professional inquiries, custom e-commerce solutions, or technical application development, please get in touch at fahad_125397@yahoo.com or connect via Contact Number at 03417700233.
          </p>
          <div className="flex items-center gap-2.5 text-xs font-light text-[#f4ecd8]/80">
            <Code size={15} className="text-amber-300 flex-shrink-0" />
            <a href="fahad_125397@yahoo.com" className="hover:text-white transition underline underline-offset-4">
              fahad_125397@yahoo.com
            </a>
          </div>
          <div className="flex items-center gap-3 pt-2">
            {/* Instagram SVG */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* Facebook SVG */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.582 9 4.75V8z" />
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* Return Policy */}
      <div id="return-policy" className="max-w-7xl mx-auto mb-10 bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 text-center scroll-mt-28">
        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-200 mb-3">
          Return Policy
        </h4>
        <p className="text-[#f4ecd8]/80 text-xs md:text-sm font-light leading-relaxed max-w-4xl mx-auto">
          At Alfalah Honey, we believe in complete transparency and absolute customer satisfaction. To ensure you receive exactly what you ordered in perfect condition, we offer a unique "Open-Door" Verification Policy at the time of delivery. When your parcel arrives, you can open and inspect it on the spot while our rider records a quick verification video. If you love the product, it’s yours; if it doesn't meet your expectations, simply return it back to the rider immediately—no questions asked.
        </p>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-[#f4ecd8]/60">
        <p>© {new Date().getFullYear()} Alfalah Honey. All rights reserved.</p>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
        >
          <span>Back to top</span>
          <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
