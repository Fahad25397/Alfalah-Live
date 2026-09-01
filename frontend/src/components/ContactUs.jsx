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
                Alfalah Honey Opposite to Salman Bakers near Sweet Cream , Gulabahr,Peshawar.
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