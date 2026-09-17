"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alfalah_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliverySettings, setDeliverySettings] = useState([]);

  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const response = await api.get('/api/delivery-settings');
        setDeliverySettings(response.data);
      } catch (err) {
        console.error('Error fetching delivery settings:', err);
      }
    };
    fetchDeliverySettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('alfalah_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    // Determine the unique identifier for the item (fallback to _id if uniqueCartId isn't present)
    const targetId = product.uniqueCartId || product._id;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => (item.uniqueCartId || item._id) === targetId);
      if (existing) {
        return prevCart.map((item) =>
          (item.uniqueCartId || item._id) === targetId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, uniqueCartId: targetId }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => (item.uniqueCartId || item._id) !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if ((item.uniqueCartId || item._id) === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  let deliveryCharge = 0;
  if (totalPrice > 10000) {
    deliveryCharge = 0;
  } else {
    // Check specific items against delivery settings
    cart.forEach(item => {
      const setting = deliverySettings.find(s => s.category === item.category && s.weight === item.weight);
      if (setting) {
        deliveryCharge += setting.charge * item.quantity;
      }
    });
  }

  const finalTotal = totalPrice + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        deliveryCharge,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
