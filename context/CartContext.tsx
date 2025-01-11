"use client";

import { addOrUpdateCart, fetchCart, removeCartItem } from "@/actions/cart";
import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  id?: number;
  unit_price: string;
  quantity: number;
  title: string;
  image: string;
  product_id: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setCartExt: (item: CartItem[]) => Promise<void>;
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

  // Fetch initial cart
  useEffect(() => {
    const fetchInitialCart = async () => {
      try {
        const response = await fetchCart();
        if (response && response.ok) {
          const data = await response.json();
          // Ensure we're setting an empty array if no items
          setCart(
            data.data["Cart Items"]?.length > 0 ? data.data["Cart Items"] : []
          );
        } else {
          console.error("Failed to fetch cart from server");
          setCart([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCart([]);
      }
    };

    fetchInitialCart();
  }, []);

  // Add or update item in cart
  const addToCart = async (item: CartItem) => {
    try {
      const response = await addOrUpdateCart({
        product_id: item.product_id,
        quantity: item.quantity,
      });

      if (response && response.ok) {
        const updatedCartData = await response.json();
        const updatedItem = updatedCartData.data.cart_item;

        setCart((prevCart) => {
          // Find if item already exists in cart
          const existingItemIndex = prevCart.findIndex(
            (cartItem) =>
              cartItem.product_id === updatedItem.product_listing_detail_id
          );

          if (existingItemIndex !== -1) {
            // Update existing item
            const newCart = [...prevCart];
            newCart[existingItemIndex] = {
              ...newCart[existingItemIndex],
              quantity: parseInt(updatedItem.quantity),
            };
            return newCart;
          } else {
            // Add new item
            return [...prevCart, updatedItem];
          }
        });
      } else {
        console.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: number) => {
    try {
      const response = await removeCartItem(id);
      if (response && response.ok) {
        await response.json();
        setCart((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Update item quantity
  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return; // Prevent negative quantities

    try {
      const response = await addOrUpdateCart({
        product_id: id,
        quantity,
      });

      if (response && response.ok) {
        const updatedCartData = await response.json();
        const updatedItem = updatedCartData.data.cart_item;

        setCart((prevCart) =>
          prevCart.map((item) =>
            item.product_id === updatedItem.product_listing_detail_id
              ? {
                  ...item,
                  quantity: parseInt(updatedItem.quantity),
                }
              : item
          )
        );
      } else {
        console.error("Failed to update item quantity");
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setCart([]);
  };

  // External cart update
  const setCartExt = async (newCart: CartItem[]) => {
    setCart(newCart || []);
  };

  // Calculate totals with safe parsing
  const totalItems = cart.reduce((total, item) => {
    const quantity = parseInt(String(item?.quantity)) || 0;
    return total + quantity;
  }, 0);

  const totalPrice = cart.reduce((total, item) => {
    const price = parseFloat(String(item?.unit_price)) || 0;
    const quantity = parseInt(String(item?.quantity)) || 0;
    return total + price * quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCartExt,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
