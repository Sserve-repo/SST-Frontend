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

  useEffect(() => {
    const fetchInitialCart = async () => {
      try {
        const response = await fetchCart();
        if (response && response.ok) {
          const data = await response.json();
          if (data.data["Cart Items"].length > 0) {
            setCart(data.data["Cart Items"]);
          } else {
            setCart([]);
          }
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

  // Add item to cart
  const addToCart = async (item: any) => {
    try {
      const response = await addOrUpdateCart({
        product_id: item.product_id,
        quantity: item.quantity,
      });

      if (response && response.ok) {
        const updatedCart = await response.json();

        setCart((prevCart) => {
          const existingItem = prevCart.find(
            (cartItem) =>
              cartItem.product_id ===
              updatedCart.data.cart_item.product_listing_detail_id
          );

          if (existingItem) {
            return prevCart.map((cartItem) =>
              cartItem.product_id ===
              updatedCart.data.cart_item.product_listing_detail_id
                ? {
                    ...cartItem,
                    quantity: parseInt(updatedCart.data.cart_item.quantity),
                  }
                : cartItem
            );
          } else {
            return [...prevCart, updatedCart.data.cart_item];
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
    try {
      const response = await addOrUpdateCart({
        product_id: id,
        quantity,
      });
      if (response && response.ok) {
        const updatedCart = await response.json();

        setCart((prevCart) => {
          return prevCart.map((item) =>
            item.product_id ===
            updatedCart.data.cart_item.product_listing_detail_id
              ? {
                  ...item,
                  quantity: parseInt(updatedCart.data.cart_item.quantity),
                }
              : item
          );
        });
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

  const setCartExt = async (cart) => {
    setCart(cart);
  };

  // Calculate total items and total price
  const totalItems = cart?.reduce(
    (total, item) => total + parseInt(`${item?.quantity}`),
    0
  );
  const totalPrice = cart?.reduce(
    (total, item) => total + parseFloat(item?.unit_price) * item?.quantity,
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
        setCartExt,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
