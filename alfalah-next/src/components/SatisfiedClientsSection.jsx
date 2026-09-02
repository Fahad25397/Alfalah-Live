"use client";
import React from 'react';
import { Users, Star, Award } from 'lucide-react';

const SatisfiedClientsSection = () => {
  return (
    <section className="w-full bg-[#3c2415] py-20 px-6 lg:px-16 text-[#f4ecd8] border-y border-amber-900/40 relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-amber-600/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-2 text-amber-400 mb-6">
          <Star size={24} fill="currentColor" />
          <Star size={24} fill="currentColor" />
          <Star size={24} fill="currentColor" />
          <Star size={24} fill="currentColor" />
          <Star size={24} fill="currentColor" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">
          Trusted by More Than <br className="hidden md:block"/>
          <span className="text-amber-500">200,000+</span> Satisfied Clients
        </h2>
        
        <p className="text-amber-100/80 max-w-2xl mx-auto text-lg font-light mb-12">
          Join our growing community of happy customers who have experienced the premium quality, purity, and natural goodness of Alfalah products.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="flex flex-col items-center bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
            <Users size={36} className="text-amber-400 mb-4" />
            <h3 className="text-3xl font-bold font-serif mb-2 text-white">200k+</h3>
            <span className="text-xs text-amber-200/70 uppercase tracking-widest font-semibold">Happy Customers</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
            <Star size={36} className="text-amber-400 mb-4" />
            <h3 className="text-3xl font-bold font-serif mb-2 text-white">4.9/5</h3>
            <span className="text-xs text-amber-200/70 uppercase tracking-widest font-semibold">Average Rating</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
            <Award size={36} className="text-amber-400 mb-4" />
            <h3 className="text-3xl font-bold font-serif mb-2 text-white">100%</h3>
            <span className="text-xs text-amber-200/70 uppercase tracking-widest font-semibold">Premium Quality</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SatisfiedClientsSection;

