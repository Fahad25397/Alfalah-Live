import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('alfalah_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliverySettings, setDeliverySettings] = useState([]);

  useEffect(() => {
    localStorage.setItem('alfalah_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const res = await api.get('/api/delivery-settings');
        setDeliverySettings(res.data);
      } catch (err) {
        console.error('Error fetching delivery settings:', err);
      }
    };
    fetchDeliverySettings();
  }, []);

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

  // Calculate Delivery Charge based on settings
  let deliveryCharge = 0;
  if (totalPrice >= 10000) {
    deliveryCharge = 0; // Free delivery for orders >= 10,000 PKR
  } else if (cart.length > 0) {
    // Determine the highest applicable delivery charge from items in cart
    let highestCharge = 150; // Default base delivery charge
    
    cart.forEach(item => {
      const category = item.category || 'Honey';
      const weight = item.weight || '';
      
      const matchedSetting = deliverySettings.find(
        s => s.category.toLowerCase() === category.toLowerCase() && s.weight === weight
      );
      
      if (matchedSetting && Number(matchedSetting.charge) > highestCharge) {
        highestCharge = Number(matchedSetting.charge);
      }
    });
    
    deliveryCharge = highestCharge;
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