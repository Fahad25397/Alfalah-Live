"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';

const slides = [
  {
    title: "Golden Goodness",
    description: "A naturally delicious choice for mindful everyday nourishment. Packed with antioxidants, vitamins, and minerals to support your immune system and overall vitality.",
    image: "/hero-images/hero-1.jpg"
  },
  {
    title: "Golden Ayurvedic Wellness",
    description: "Rich in CLA and fat-soluble vitamins, this golden superfood recharges your metabolism, reduces inflammation, and elevates your daily vitality.",
    image: "/hero-images/hero-2.jpg"
  },
  {
    title: "Organic Fruit Spread",
    description: "Crafted from 100% organic, sun-ripened fruit and sweetened naturally. Packed with vitamins and real fruit fiber to fuel your morning with clean energy.",
    image: "/hero-images/hero-3.jpg"
  },
  {
    title: "Premium Quality Imported Dates",
    description: "Handpicked from Madinah's finest organic groves. Packed with raw fiber, potassium, and antioxidants to naturally fuel your body, protect your heart, and elevate your daily wellness.",
    image: "/hero-images/hero-4.jpg"
  },
  {
    title: "Faith In Every Drop",
    description: "Bring the blessed water of Zamzam closer to your home. Sourced from the sacred wells of Makkah, this pure and refreshing water is naturally alkaline, rich in minerals, and free from contaminants.",
    image: "/hero-images/hero-5.jpg"
  },
  {
    title: "Olive Heritage",
    description: "Traditional olive goodness blended with quality and natural nourishment. Sustainably sourced from the Mediterranean, this premium olive oil is rich in antioxidants and heart-healthy fats to support your overall wellness.",
    image: "/hero-images/hero-6.jpg"
  },
  {
    title: "Dry Fruits",
    description: "Nature's premium treasures: crunchy almonds, creamy cashews, and rich walnuts, crafted perfectly for your wholesome, aesthetic snacking moments.",
    image: "/hero-images/hero-7.jpg"
  },
  {
    title: "Shilajit",
    description: "Pure, potent Ayurvedic resin: raw Himalayan shilajit, packed with fulvic acid to naturally elevate your daily energy, vitality, and aesthetic wellness routine.",
    image: "/hero-images/hero-8.jpg"
  },
  {
    title: "Saffron",
    description: "Crimson threads of luxury: pure, handpicked royal saffron, releasing a golden glow and rich aroma for ultimate wellness excellence.",
    image: "/hero-images/hero-9.jpg"
  }
];

const Hero = ({ onOpenCart, onOpenAdmin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    // Balanced mobile top padding so it doesn't touch the fixed navbar + announcement bar
    <section id="hero" aria-label="Featured Products Carousel" className="w-full bg-[#faf8f5] pt-28 md:pt-[7.5rem] pb-6 scroll-mt-36">
      {/* Navbar sits at the top */}
      <Navbar onOpenCart={onOpenCart} onOpenAdmin={onOpenAdmin} />

      {/* Hero Box Container */}
      <div className="mx-2 sm:mx-3 mt-2 md:mt-4 relative w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] min-h-[85vh] bg-[#221a15] text-white flex flex-col justify-between overflow-hidden rounded-[2.5rem] shadow-xl">

        {/* Full-Width Sliding Image Track Background with Soft Crossfade & Ken Burns Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]" role="region" aria-roledescription="carousel" aria-label="Product highlight slides">
          {slides.map((slide, idx) => {
            const isActive = currentSlide === idx;
            return (
              <div
                key={idx}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${slides.length}: ${slide.title}`}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
              >
                <img
                  src={slide.image}
                  alt={`${slide.title} — ${slide.description.substring(0, 100)}`}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  width="1600"
                  height="900"
                  className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out ${isActive ? 'scale-105' : 'scale-100'
                    }`}
                />
                {/* Balanced dark gradient overlay to ensure white text remains crisp and readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              </div>
            );
          })}
        </div>

        {/* Hero Content Layer with Gentle Fade & Upward Drift */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 lg:px-12 pt-28 pb-20 mt-auto flex items-center" aria-live="polite" aria-atomic="true">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">

            <div className="lg:col-span-8 xl:col-span-7 space-y-6 text-left">
              <div key={currentSlide} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
                <h1 className="text-4xl sm:text-6xl font-serif font-normal text-white tracking-wide leading-tight drop-shadow-md">
                  {slides[currentSlide].title}
                </h1>

                <p className="text-white/90 text-base sm:text-lg max-w-xl font-light leading-relaxed drop-shadow-sm">
                  {slides[currentSlide].description}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-white/90 text-[#3c2415] font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-md"
                >
                  Explore Items <ArrowRight size={17} className="text-[#3c2415]/70" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Slide Navigation Controls */}
        <div className="relative z-30 max-w-7xl mx-auto w-full px-6 lg:px-12 pb-10 flex justify-end">
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-md cursor-pointer border border-white/25 active:scale-95 shadow-xs"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/25 shadow-xs">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${currentSlide === idx ? 'bg-white w-6' : 'bg-white/40 w-1.5'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-md cursor-pointer border border-white/25 active:scale-95 shadow-xs"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
