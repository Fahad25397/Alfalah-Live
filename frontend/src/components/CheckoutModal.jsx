import React, { useState } from 'react';
import { X, CheckCircle, Loader } from 'lucide-react';
import api from '../api';
import { useCart } from '../context/CartContext';


const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, totalPrice, clearCart, setIsCartOpen } = useCart();
  const formatPrice = (price) => `Rs. ${Number(price).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer: formData,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice,
      };

      await api.post('/api/orders', orderData);
      
      setLoading(false);
      setSuccess(true);
      clearCart();
    } catch (err) {
      setLoading(false);
      console.error('Order creation error:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleFinish = () => {
    setSuccess(false);
    onClose();
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#fffdfa] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-amber-900/20 relative p-6">
        
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-amber-900 hover:bg-amber-100 rounded-lg transition cursor-pointer"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle size={60} className="text-emerald-600 mx-auto mb-4 animate-bounce" />
            <h3 className="font-serif text-2xl font-bold text-[#3c2415]">Order Placed Successfully!</h3>
            <p className="text-amber-800 text-sm mt-2 max-w-xs mx-auto">
              Thank you for choosing Alfalah Honey! Your order details have been saved, and we will contact you shortly regarding delivery.
            </p>
            <button
              onClick={handleFinish}
              className="mt-6 px-6 py-3 bg-[#3c2415] hover:bg-amber-700 text-amber-100 font-bold rounded-xl transition cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#3c2415] mb-2">Guest Checkout</h3>
            <p className="text-xs text-amber-800/80 mb-6">Enter delivery information below to complete your order.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3c2415] uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Fahad Khan"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3c2415] uppercase tracking-wider mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="fahad@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3c2415] uppercase tracking-wider mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#3c2415] uppercase tracking-wider mb-1">Shipping Address</label>
                  <input 
                    type="text" 
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street 4, Sector G-9"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3c2415] uppercase tracking-wider mb-1">City</label>
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Islamabad"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Responsive Bottom Section */}
              <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-amber-800 font-medium block">Total Due:</span>
                  <span dir="ltr" className="text-xl font-bold text-amber-700">{formatPrice(totalPrice)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Placing Order...
                    </>
                  ) : (
                    'Confirm Order (Cash on Delivery)'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutModal;