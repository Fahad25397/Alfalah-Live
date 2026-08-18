import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, X } from 'lucide-react';

const AboutBookSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Who We Are",
      content: "Founded 36 years ago in 1990 by Gull and Son's, Alfalah began as a humble venture rooted in honesty and quality. Over three decades, that same dedication has shaped us into a trusted name — carrying forward a founder's vision, one generation of craftsmanship and customer trust at a time."
    },
    {
      title: "Our Mission",
      content: "At Alfalah, our mission is to deliver quality that speaks for itself — blending tradition with trust in every product we offer. We strive to honor Haji Hafeezullah's founding vision, serving our customers with honesty, consistency, and care, while building a legacy that lasts for generations to come."
    },
    {
      title: "Our Values",
      content: "Integrity guides every decision we make. We believe in honest pricing, genuine quality, and lasting relationships built on trust. Rooted in Haji Hafeezullah's founding principles, we value craftsmanship, respect for our customers, and consistency in everything we deliver , staying true to who we are, always"
    }
  ];

  const nextPage = (e) => {
    e.stopPropagation();
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = (e) => {
    e.stopPropagation();
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section id="about" className="py-16 px-6 lg:px-16 bg-[#faf8f5] relative overflow-hidden border-t border-amber-200/60 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Brown Header Box matching your store section style with "Our Roots" */}
        <div className="bg-[#3c2415] backdrop-blur-md px-6 py-4 rounded-3xl border border-[#3c2415]/80 shadow-md flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <BookOpen size={22} className="text-[#f4ecd8]" />
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
              Our Roots
            </h2>
          </div>
          <span className="text-xs font-medium text-amber-200/80 hidden sm:inline-block">
            <i>Alfalah's Journey</i>
          </span>
        </div>

        {/* Main Content Layout - items-start aligns left text precisely with the top edge of the book */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Heading & Description */}
          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#3c2415] tracking-tight">
              From Humble Beginnings to a Legacy of Excellence
            </h3>
            <p className="text-[#3c2415]/80 text-sm sm:text-base leading-relaxed font-light">
              What began as a small, honest effort has grown into a name people trust. Alfalah's journey has always been about one thing — never compromising on quality, no matter how far we've come.
            </p>
          </div>

          {/* Right Side: Interactive Book Container */}
          <div className="flex justify-center items-center">
            {!isOpen ? (
              /* Closed Book Cover Box */
              <div 
                onClick={() => setIsOpen(true)}
                className="w-72 sm:w-80 h-96 bg-gradient-to-br from-[#3c2415] to-[#27170d] rounded-r-3xl rounded-l-md shadow-2xl p-8 flex flex-col justify-between cursor-pointer transform hover:scale-105 transition duration-300 border-l-8 border-[#5a3821] relative group"
              >
                <div className="absolute inset-y-0 left-0 w-4 bg-black/20 rounded-l-md"></div>
                <div className="text-center space-y-3 mt-8 z-10">
                  <span className="text-amber-200/80 text-xs tracking-widest uppercase font-semibold">Our Journey</span>
                  <h4 className="text-2xl sm:text-3xl font-serif font-bold text-[#f4ecd8]">ALFALAH</h4>
                  <div className="w-12 h-0.5 bg-amber-200/40 mx-auto"></div>
                </div>
                <div className="text-center z-10 mb-6">
                  <span className="inline-block px-4 py-2 bg-amber-200/10 text-amber-100 rounded-xl text-xs font-medium group-hover:bg-amber-200/20 transition">
                    Click to Open Book 📖
                  </span>
                </div>
              </div>
            ) : (
              /* Opened Book View with Brown Theme and Brown Header Bar */
              <div className="w-full max-w-md h-96 bg-[#faf8f5] rounded-3xl shadow-2xl border border-amber-200 flex flex-col justify-between relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                
                {/* Brown Header Bar inside the opened book */}
                <div className="bg-[#3c2415] px-6 py-3.5 flex items-center justify-between border-b border-[#3c2415]/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200/90">
                    OUR JOURNEY - ALFALAH
                  </span>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-black/20 text-amber-200 transition cursor-pointer"
                    title="Close Book"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Page Content */}
                <div className="py-4 px-6 space-y-4 my-auto">
                  <h4 className="text-xl font-serif font-bold text-[#3c2415]">
                    {pages[currentPage].title}
                  </h4>
                  <p className="text-[#3c2415]/80 text-sm sm:text-base leading-relaxed font-light">
                    {pages[currentPage].content}
                  </p>
                </div>

                {/* Page Navigation Footer */}
                <div className="flex items-center justify-between px-6 py-3.5 border-t border-amber-900/10 bg-[#faf8f5]">
                  <button 
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      currentPage === 0 
                        ? 'opacity-40 cursor-not-allowed text-[#3c2415]/40' 
                        : 'hover:bg-[#3c2415]/10 text-[#3c2415] cursor-pointer'
                    }`}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <span className="text-xs font-medium text-[#3c2415]/60">
                    Page {currentPage + 1} of {pages.length}
                  </span>

                  <button 
                    onClick={nextPage}
                    disabled={currentPage === pages.length - 1}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      currentPage === pages.length - 1 
                        ? 'opacity-40 cursor-not-allowed text-[#3c2415]/40' 
                        : 'hover:bg-[#3c2415]/10 text-[#3c2415] cursor-pointer'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutBookSection;