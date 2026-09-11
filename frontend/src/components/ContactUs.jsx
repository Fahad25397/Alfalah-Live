import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Clock } from 'lucide-react';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 px-6 lg:px-16 bg-[#faf8f5] relative overflow-hidden border-t border-amber-200/60 scroll-mt-24">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="bg-[#3c2415] backdrop-blur-md px-6 py-4 rounded-3xl border border-[#3c2415]/80 shadow-md flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Mail size={22} className="text-[#f4ecd8]" />
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
              Contact Us
            </h2>
          </div>
          <span className="text-xs font-medium text-amber-200/80 hidden sm:inline-block">
            <i>We're here to help</i>
          </span>
        </div>

        {/* Centered Contact Information Layout */}
        <div className="max-w-3xl mx-auto space-y-10 text-center">
          <div className="space-y-4">
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#3c2415] tracking-tight">
              Get in Touch with Alfalah
            </h3>
            <p className="text-[#3c2415]/80 text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto">
              Have a question about our products, orders, or looking for assistance? Reach out to our team through any of the channels below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="bg-[#f5eaba] p-6 rounded-3xl border border-amber-200/80 shadow-sm flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-2xl bg-[#3c2415] text-amber-200 shadow-md">
                <MapPin size={22} />
              </div>
              <h4 className="font-serif font-bold text-[#3c2415] text-lg">Our Location</h4>
              <p className="text-[#3c2415]/70 text-sm font-light">
                Alfalah Honey Opposite to Salman Bakers near Soft Swirl , Gulbahar, Peshawar.
              </p>
            </div>

            <div className="bg-[#f5eaba] p-6 rounded-3xl border border-amber-200/80 shadow-sm flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-2xl bg-[#3c2415] text-amber-200 shadow-md">
                <Phone size={22} />
              </div>
              <h4 className="font-serif font-bold text-[#3c2415] text-lg">Phone Support</h4>
              <p className="text-[#3c2415]/70 text-sm font-light">
                03331010640
              </p>
            </div>

            <div className="bg-[#f5eaba] p-6 rounded-3xl border border-amber-200/80 shadow-sm flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-2xl bg-[#3c2415] text-amber-200 shadow-md">
                <Mail size={22} />
              </div>
              <h4 className="font-serif font-bold text-[#3c2415] text-lg">Email Us</h4>
              <p className="text-[#3c2415]/70 text-sm font-light">
                alfalahhoney2@gmail.com
              </p>
            </div>
            <div className="bg-[#f5eaba] p-6 rounded-3xl border border-amber-200/80 shadow-sm flex flex-col items-center text-center space-y-3">
              <div className="flex gap-3">
                <a href="https://www.instagram.com/alfalah_honey_gulbahar?utm_source=qr" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-[#3c2415] text-amber-200 shadow-md hover:bg-[#4d301c] transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/1M7PpHWra6/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-[#3c2415] text-amber-200 shadow-md hover:bg-[#4d301c] transition-colors" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@alfalah_honey_gulbahar?_r=1&_t=ZS-99JuHUOZ8rs" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-[#3c2415] text-amber-200 shadow-md hover:bg-[#4d301c] transition-colors" aria-label="TikTok">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04.15 1.5.85 2.87 1.94 3.82.99.87 2.29 1.34 3.63 1.35v4.05c-1.35.03-2.67-.32-3.8-1-.74-.46-1.39-1.04-1.92-1.72-.03 2.54-.04 5.09-.04 7.64 0 3.39-2.58 6.36-5.95 6.74-3.41.38-6.62-1.78-7.55-5.06-.94-3.27 1.08-6.65 4.31-7.4 1.25-.29 2.56-.25 3.79.16V12.7c-1.46-.38-3.03-.12-4.29.74-1.32.9-2.07 2.45-1.96 4.02.13 1.76 1.48 3.23 3.23 3.51 1.76.28 3.53-.59 4.38-2.14.47-.85.73-1.83.74-2.82V.02z"/>
                  </svg>
                </a>
              </div>
              <h4 className="font-serif font-bold text-[#3c2415] text-lg">Social Media</h4>
              <p className="text-[#3c2415]/70 text-sm font-light">
                Follow us online
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactUs;