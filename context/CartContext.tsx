"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
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

const items = [
  {
    id: 1,
    name: "Adjustable Standing Desk",
    price: 299.99,
    rating: 4.5,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 2,
    name: "Ergonomic Keyboard",
    price: 79.99,
    rating: 4.3,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 3,
    name: "Anti-Fatigue Mat",
    price: 39.99,
    rating: 4.6,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 4,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 5,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 6,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 7,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 8,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 9,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
];

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
    const savedCart = localStorage.getItem("cart");
    if (savedCart && JSON.parse(savedCart) > 0) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
