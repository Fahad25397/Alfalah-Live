import React from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Heart, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

import SEO from './SEO';
import { getImageUrl } from '../api';

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const formatPrice = (price) => `Rs. ${price}`;

  if (!product) return null;

  const displayVariant = product.variants && product.variants.length > 0 
    ? product.variants[0] 
    : { weight: product.weight || 'Standard', price: product.price || 0, isSale: product.isSale, oldPrice: product.oldPrice, outOfStock: product.outOfStock };

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
      "price": displayVariant.price,
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
      <div className="bg-[#fffdfa] w-full max-w-2xl max-h-[95vh] overflow-y-auto custom-scrollbar rounded-3xl shadow-2xl border border-amber-900/20 relative p-6 md:p-8">
        
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
              src={getImageUrl(product.image, 800)} 
              alt={product.name}
              loading="eager"
              decoding="async"
              width="800"
              height="800"
              className={`w-full h-full object-cover ${displayVariant.outOfStock ? 'opacity-50 grayscale' : ''}`}
            />
            
            {displayVariant.outOfStock ? (
              <span className="absolute top-3 right-3 bg-gray-800 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md z-10 pointer-events-none">
                OUT OF STOCK
              </span>
            ) : displayVariant.isSale && (
              <span className="absolute top-3 right-3 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md z-10 pointer-events-none">
                {displayVariant.oldPrice && displayVariant.oldPrice > displayVariant.price 
                  ? `-${Math.round(((displayVariant.oldPrice - displayVariant.price) / displayVariant.oldPrice) * 100)}% OFF`
                  : 'SALE'}
              </span>
            )}

            <span className="absolute top-3 left-3 bg-amber-500 text-amber-950 font-bold text-xs px-3 py-1 rounded-full shadow-sm">
              {displayVariant.weight}
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
              {product.urduName && (
                <h3 dir="rtl" className="text-xl font-bold text-[#3c2415] opacity-90 mt-1">
                  {product.urduName}
                </h3>
              )}
              <div className="flex items-baseline flex-wrap gap-x-2 mt-1">
                {displayVariant.isSale && displayVariant.oldPrice && (
                  <span className="text-lg font-bold text-gray-400 line-through">
                    {formatPrice(displayVariant.oldPrice)}
                  </span>
                )}
                <span className="text-2xl font-bold text-amber-700 block">
                  {formatPrice(displayVariant.price)}
                </span>
              </div>
            </div>

            <div className="max-h-40 md:max-h-52 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-amber-900/80 text-sm leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

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
                disabled={displayVariant.outOfStock}
                className={`flex-1 py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg ${
                  displayVariant.outOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#3c2415] hover:bg-amber-600 text-amber-100 font-bold cursor-pointer'
                }`}
              >
                <ShoppingCart size={18} /> {displayVariant.outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;