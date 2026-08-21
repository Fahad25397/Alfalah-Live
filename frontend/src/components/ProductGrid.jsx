import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { Star, ShoppingCart, Loader, Search, Eye, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import ProductDetailModal from './ProductDetailModal';

const CATEGORIES = ['Honey', 'For Men', 'Dry Fruits', 'Zamzam Water', 'Olive Oil', 'Dates', 'Desi Ghee'];

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();

  // Refs to control horizontal scrolling per category row
  const rowRefs = useRef({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        const loadedProducts = response.data || [];
        setProducts(loadedProducts);
        setLoading(false);
        
        // Initial state is set via the effect below this one
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to connect to backend server.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const productIdFromUrl = searchParams.get('product');
    if (productIdFromUrl) {
      if (!selectedProduct || selectedProduct._id !== productIdFromUrl) {
        const p = products.find(x => x._id === productIdFromUrl);
        if (p) setSelectedProduct(p);
      }
    } else {
      if (selectedProduct) setSelectedProduct(null);
    }
  }, [searchParams, products]);

  const handleVariantChange = (productId, index) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: index }));
  };

  const openProductModal = (p) => {
    setSelectedProduct(p);
    setSearchParams({ product: p._id }, { replace: true });
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('product');
    setSearchParams(newParams, { replace: true });
  };

  const handleAddToCartWithVariant = (product) => {
    const activeVariantIndex = selectedVariants[product._id] || 0;
    const chosenVariant = product.variants?.[activeVariantIndex] || { weight: 'Standard', price: product.price };

    const productWithVariant = {
      ...product,
      weight: chosenVariant.weight,
      price: chosenVariant.price,
      uniqueCartId: `${product._id}-${chosenVariant.weight}`
    };

    addToCart(productWithVariant);
  };

  const matchesCategory = (productCat, targetCat) => {
    let pCat = (productCat || "").trim().toLowerCase();
    if (!pCat) pCat = "honey";
    const tCat = targetCat.trim().toLowerCase();

    if (tCat === 'desi ghee' && (pCat.includes('ghee') || pCat.includes('desi'))) return true;
    if (tCat === 'zamzam water' && (pCat.includes('zamzam') || pCat.includes('water'))) return true;
    if (tCat === 'jam' && pCat.includes('jam')) return true;
    if (tCat === 'olive oil' && pCat.includes('olive')) return true;
    if (tCat === 'dates' && pCat.includes('date')) return true;
    if (tCat === 'honey' && pCat.includes('honey')) return true;
    if (tCat === 'dry fruits' && (pCat.includes('dry') || pCat.includes('fruit') || pCat.includes('pistachio') || pCat.includes('almond') || pCat.includes('cashew'))) return true;
    if (tCat === 'for men' && (pCat.includes('for men') || pCat.includes('men'))) return true;

    return pCat === tCat;
  };

  const getFilteredProducts = () => {
    return products
      .filter((p) => {
        const matchesSearch = 
          (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

        if (activeCategory === 'All') return matchesSearch;
        return matchesSearch && matchesCategory(p.category, activeCategory);
      })
      .sort((a, b) => {
        const activeA = selectedVariants[a._id] || 0;
        const activeB = selectedVariants[b._id] || 0;
        const priceA = a.variants?.[activeA]?.price || a.price || 0;
        const priceB = b.variants?.[activeB]?.price || b.price || 0;

        if (sortBy === 'low-to-high') return priceA - priceB;
        if (sortBy === 'high-to-low') return priceB - priceA;
        return 0;
      });
  };

  const filteredItems = getFilteredProducts();

  const groupedProducts = CATEGORIES.reduce((acc, cat) => {
    const itemsInCat = filteredItems.filter(p => matchesCategory(p.category, cat));
    if (itemsInCat.length > 0) {
      acc[cat] = itemsInCat;
    }
    return acc;
  }, {});

  const scrollRow = (categoryName, direction) => {
    const container = rowRefs.current[categoryName];
    if (container) {
      const scrollAmount = container.clientWidth * 0.75; // Scrolls 75% of the visible container width smoothly
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderProductCard = (p) => {
    const variants = p.variants && p.variants.length > 0 ? p.variants : [{ weight: 'Standard', price: p.price || 0 }];
    const currentVariantIndex = selectedVariants[p._id] || 0;
    const currentVariant = variants[currentVariantIndex] || variants[0];

    return (
      <div 
        key={p._id} 
        className="min-w-[280px] sm:min-w-[310px] max-w-[310px] flex-shrink-0 snap-start bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-amber-200/60 transition-all duration-300 group flex flex-col justify-between"
      >
        <div>
          <div className="relative h-60 overflow-hidden bg-amber-50">
            <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" onClick={() => openProductModal(p)} />
            <button onClick={() => openProductModal(p)} className="absolute inset-x-4 bottom-4 bg-white/90 backdrop-blur-md text-[#3c2415] font-semibold text-xs py-2.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer">
              <Eye size={14} /> Quick View
            </button>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-amber-600 text-xs">
                <Star size={14} fill="currentColor" />
                <span className="font-semibold text-[#3c2415]">5.0</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3c2415]/70 bg-amber-100/60 px-2.5 py-1 rounded-lg">
                {p.category || 'Organic'}
              </span>
            </div>

            <h3 onClick={() => openProductModal(p)} className="font-serif font-bold text-lg text-[#3c2415] hover:text-amber-700 transition cursor-pointer truncate">
              {p.name}
            </h3>
            <p className="text-[#3c2415]/70 text-xs mt-1.5 line-clamp-2 font-light leading-relaxed">
              {p.description}
            </p>

            {/* WEIGHT / SIZE VARIANT SELECTOR */}
            <div className="mt-5">
              <span className="text-[10px] font-bold text-[#3c2415]/60 uppercase tracking-widest block mb-2">
                Select Weight:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {variants.map((v, idx) => (
                  <button
                    key={v.weight}
                    onClick={() => handleVariantChange(p._id, idx)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      currentVariantIndex === idx
                        ? 'bg-[#3c2415] text-[#f4ecd8] border-[#3c2415] shadow-sm'
                        : 'bg-[#faf8f5] text-[#3c2415] border-amber-200/80 hover:bg-amber-100/50'
                    }`}
                  >
                    {currentVariantIndex === idx && <Check size={12} />}
                    {v.weight}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 pt-0 flex items-center justify-between mt-4">
          <div>
            <span className="text-[10px] text-[#3c2415]/60 uppercase font-bold tracking-wider block">Price</span>
            <span dir="ltr" className="inline-block text-xl font-serif font-bold text-[#3c2415]">{formatPrice(currentVariant.price)}</span>
          </div>
          <button 
            onClick={() => handleAddToCartWithVariant(p)} 
            className="px-5 py-3 bg-[#3c2415] hover:bg-[#2b1c12] text-[#f4ecd8] rounded-2xl transition flex items-center gap-2 text-xs font-medium cursor-pointer shadow-md active:scale-95"
          >
            <ShoppingCart size={15} /> Add
          </button>
        </div>
      </div>
    );
  };

  const renderCategoryRow = (categoryName, items) => (
    <div key={categoryName} className="mb-14">
      {/* Brown Category Header Box with White Text */}
      <div className="bg-[#3c2415] backdrop-blur-md px-6 py-4 rounded-3xl border border-[#3c2415]/80 shadow-md flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-serif font-bold text-white">
          {categoryName}
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scrollRow(categoryName, 'left')}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#3c2415] text-white border border-white/20 shadow-xs flex items-center justify-center transition cursor-pointer active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => scrollRow(categoryName, 'right')}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#3c2415] text-white border border-white/20 shadow-xs flex items-center justify-center transition cursor-pointer active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div 
        ref={(el) => (rowRefs.current[categoryName] = el)}
        className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
      >
        {items.map(p => renderProductCard(p))}
      </div>
    </div>
  );

  return (
    <section id="products" className="w-full bg-[#faf8f5] py-24 px-6 lg:px-16 border-t border-amber-200/60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#3c2415]">
            Shop Our Varieties
          </h2>
          <p className="text-[#3c2415]/70 mt-3 max-w-md mx-auto text-sm font-light">
            Browse Alfalah's premium collections and pick the perfect size for your daily wellness.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-[#3c2415] backdrop-blur-md p-4 rounded-3xl border border-[#3c2415]/80 shadow-md mb-10 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3c2415]/60" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/90 rounded-2xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f5eaba] text-[#3c2415] placeholder-[#3c2415]/40"
            />
          </div>

          <div className="bg-white/90 px-4 py-3 rounded-2xl border border-amber-200 text-sm">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none font-medium text-[#3c2415] cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills with Increased Font Size and Padding */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-12 scrollbar-none">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-6 py-3 rounded-2xl text-sm sm:text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'All' 
                ? 'bg-[#3c2415] text-[#f4ecd8] shadow-md' 
                : 'bg-white/80 hover:bg-white text-[#3c2415] border border-amber-200/80'
            }`}
          >
            All Items
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-sm sm:text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-[#3c2415] text-[#f4ecd8] shadow-md' 
                  : 'bg-white/80 hover:bg-white text-[#3c2415] border border-amber-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-[#3c2415] gap-3">
            <Loader className="animate-spin" size={28} />
            <span className="font-medium text-lg">Loading products...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10 px-4 bg-amber-100/50 rounded-2xl border border-amber-300 text-[#3c2415] max-w-md mx-auto">
            <p>{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white/80 rounded-3xl border border-amber-200 text-[#3c2415]">
            <p className="font-serif text-lg">No products found matching your search.</p>
          </div>
        ) : activeCategory === 'All' ? (
          <div>
            {Object.entries(groupedProducts).map(([categoryName, items]) => 
              renderCategoryRow(categoryName, items)
            )}
          </div>
        ) : (
          <div>
            {renderCategoryRow(activeCategory, filteredItems)}
          </div>
        )}

        <ProductDetailModal product={selectedProduct} onClose={closeProductModal} />
      </div>
    </section>
  );
};

export default ProductGrid;