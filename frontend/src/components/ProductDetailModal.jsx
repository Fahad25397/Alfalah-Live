import React from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Heart, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext'; // <-- Added currency hook
import SEO from './SEO';
import { getImageUrl } from '../api';

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency(); // <-- Initialized currency formatter

  if (!product) return null;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": getImageUrl(product.image),
    "description": product.description,
    "sku": product._id,
    "offers": {
      "@type": "Offer",
      "url": `https://alfalah-store.vercel.app/?product=${product._id}`,
      "priceCurrency": "PKR",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <SEO 
        title={`${product.name} | Alfalah Store`}
        description={product.description}
        url={`https://alfalah-store.vercel.app/?product=${product._id}`}
        image={getImageUrl(product.image)}
        schema={productSchema}
      />
      <div className="bg-[#fffdfa] w-full max-w-2xl rounded-3xl shadow-2xl border border-amber-900/20 overflow-hidden relative p-6 md:p-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-amber-900 hover:bg-amber-100 rounded-full transition z-10 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image Column */}
          <div className="relative rounded-2xl overflow-hidden bg-amber-50 h-64 md:h-80 border border-amber-100">
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
            <span className="absolute top-3 left-3 bg-amber-500 text-amber-950 font-bold text-xs px-3 py-1 rounded-full shadow-sm">
              {product.weight}
            </span>
          </div>

          {/* Details Column */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1 text-amber-500 text-sm mb-1">
                <Star size={16} fill="currentColor" />
                <span className="font-semibold text-amber-900">5.0 Organic Grade</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#3c2415]">{product.name}</h2>
              {/* Updated to use formatPrice instead of hardcoded $ */}
              <span className="text-2xl font-bold text-amber-700 mt-1 block">{formatPrice(product.price)}</span>
            </div>

            <p className="text-amber-900/80 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Highlights */}
            <div className="space-y-2 py-3 border-y border-amber-100 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-600" />
                <span>100% Raw, Pure & Unpasteurized</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-amber-600" />
                <span>Rich in natural enzymes & antioxidants</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-amber-600" />
                <span>Fast Cash on Delivery nationwide</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button 
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="flex-1 py-3 bg-[#3c2415] hover:bg-amber-600 text-amber-100 font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;