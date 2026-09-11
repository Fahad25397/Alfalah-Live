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
        <nav className="space-y-4" aria-label="Footer Navigation">
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
        </nav>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-amber-200">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-xs font-light">
            <li className="flex items-center gap-2.5 text-[#f4ecd8]/80">
              <MapPin size={15} className="text-amber-300 flex-shrink-0" />
              <span>Alfalah Honey Opposite to Salman Bakers near Soft Swirl , Gulbahar, Peshawar</span>
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
            <Mail size={15} className="text-amber-300 flex-shrink-0" />
            <a href="mailto:fahad_125397@yahoo.com" className="hover:text-white transition underline underline-offset-4">
              fahad_125397@yahoo.com
            </a>
          </div>
        </div>

      </div>

      {/* Return Policy */}
      <div id="return-policy" role="complementary" aria-label="Return Policy" className="max-w-7xl mx-auto mb-10 bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 text-center scroll-mt-28">
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
          aria-label="Scroll back to top"
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
