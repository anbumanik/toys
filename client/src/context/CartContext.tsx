import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Product } from '../types/product';
import { getFinalPrice } from '../utils/price';
import { getProduct } from '../api/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getInitialCart = (): CartItem[] => {
  const stored = localStorage.getItem('cart');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem('cart');
    }
  }
  return [];
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(getInitialCart);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (syncedRef.current || items.length === 0) return;
    syncedRef.current = true;
    
    const syncCart = async () => {
      try {
        const updatedItems = await Promise.all(
          items.map(async (item) => {
            try {
              const freshProduct = await getProduct(item.product._id!);
              return { ...item, product: freshProduct };
            } catch {
              return null; // Product might have been deleted
            }
          })
        );
        const validItems = updatedItems.filter(Boolean) as CartItem[];
        setItems(validItems);
      } catch (err) {
        console.error('Failed to sync cart', err);
      }
    };
    
    syncCart();
  }, []); // Run once on mount

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev.map(item => 
          item.product._id === product._id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) => 
      prev.map(item => 
        item.product._id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (getFinalPrice(item.product) * item.quantity), 0);
  const totalShipping = items.reduce((sum, item) => sum + ((item.product.shipping?.charge || 0) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, totalShipping }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
