"use client";

import {
  addToCart,
  clearCart,
  fetchCart,
  removeFromCart,
  updateQuantity,
} from "@/actions/cart";
import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    fetchCart(setCart);
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: (item) => addToCart(item, setCart),
        removeFromCart: (id) => removeFromCart(id, setCart),
        updateQuantity: (id, quantity) => updateQuantity(id, quantity, setCart),
        clearCart: () => clearCart(setCart),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
