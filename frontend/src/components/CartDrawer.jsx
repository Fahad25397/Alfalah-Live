import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import CheckoutModal from './CheckoutModal';
import { getImageUrl } from '../api';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { formatPrice } = useCurrency();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          {/* Main Container changed from bg-[#f5eaba] to bg-white */}
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-amber-900/20">
            
            {/* Header - Matching Navbar Box Style and Color */}
            <div className="bg-[#3c2415] backdrop-blur-md px-6 py-4 rounded-3xl border border-[#3c2415]/80 shadow-md m-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-white" size={24} />
                <h2 className="font-serif text-xl font-bold text-white">Shopping Cart</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#3c2415] text-white border border-white/20 shadow-xs flex items-center justify-center transition cursor-pointer active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-[#3c2415]/70">
                  <ShoppingBag size={48} className="mx-auto mb-3 opacity-40 text-[#3c2415]" />
                  <p className="font-medium text-lg text-[#3c2415]">Your cart is empty</p>
                  <p className="text-sm mt-1 text-[#3c2415]/70">Explore our honey harvest and add something sweet!</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.uniqueCartId || item._id} 
                    className="flex items-center gap-4 p-4 bg-[#f5eaba] backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-sm"
                  >
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-xl border border-amber-200/60 bg-white" 
                    />
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-[#3c2415] text-sm">{item.name}</h4>
                      {item.weight && <span className="text-[11px] text-[#3c2415]/70 font-medium block">{item.weight}</span>}
                      <span dir="ltr" className="text-[#3c2415] font-semibold text-sm">{formatPrice(item.price)}</span>
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => updateQuantity(item.uniqueCartId || item._id, -1)}
                          className="p-1 rounded-lg bg-white/80 hover:bg-white text-[#3c2415] transition cursor-pointer border border-amber-200/60"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-6 text-center text-[#3c2415]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.uniqueCartId || item._id, 1)}
                          className="p-1 rounded-lg bg-white/80 hover:bg-white text-[#3c2415] transition cursor-pointer border border-amber-200/60"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.uniqueCartId || item._id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Checkout Summary with Creamy Box Background */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#f5eaba] border-t border-amber-200/40 space-y-4 m-4 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center text-lg font-bold text-[#3c2415]">
                  <span>Total:</span>
                  <span dir="ltr" className="text-[#3c2415]">{formatPrice(totalPrice)}</span>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 bg-[#3c2415] hover:bg-[#2b1c12] text-[#f4ecd8] font-bold rounded-2xl shadow-md hover:shadow-lg transition text-center cursor-pointer"
                >
                  Checkout
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
};

export default CartDrawer;