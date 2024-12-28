"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import OrderSummary from "../checkout/_components/OrderSummary";
import { Minus, Plus, Trash2 } from "lucide-react";
import { fetchCart } from "@/actions/cart";

const CartPage = () => {
  const { cart, setCartExt, removeFromCart, updateQuantity } = useCart();
  const [cartMetadata, setCartMetadata] = useState<any | null>(null);

  const handleFetchCart = useCallback(async () => {
    const response = await fetchCart();
    const data = response && (await response.json());
    if (response && response.ok) {
      setCartExt(data.data["Cart Items"]);
      setCartMetadata(data.data);
    } else {
      console.error("Failed to fetch cart from server");
    }
  }, [setCartExt]);

  useEffect(() => {
    handleFetchCart();
  }, [handleFetchCart]);

  if (!cart || cart?.length === 0) {
    return (
      <div className="container mx-auto flex justify-center items-center flex-col min-h-screen px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="mb-4">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-24 sm:py-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 lg:col-span-2 pr-0 lg:pr-4 mx-6">
          <h1 className="text-2xl font-bold mb-4 text-black">Your Cart</h1>
          {cart &&
            cart?.length > 0 &&
            cart.map((item) => (
              <div
                key={item?.product_id}
                className="flex items-center border-b py-4"
              >
                <Link href={`/products/${item?.product_id}`}>
                  <img
                    src={item?.image}
                    alt={item?.title}
                    className="w-24 h-24 rounded object-cover mr-4"
                  />
                </Link>
                <div className="flex-grow text-black">
                  <h2 className="font-semibold">{item?.title}</h2>
                  <p className="text-gray-600">
                    ${parseInt(item?.unit_price).toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateQuantity(item?.product_id, item?.quantity - 1)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2">{item?.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (item) {
                          updateQuantity(item.product_id, item.quantity + 1);
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-4"
                      onClick={() => {
                        if (item && item.id) {
                          removeFromCart(item?.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(parseInt(item?.unit_price) * item?.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <div>
          {cart && cart.length > 0 && (
            <OrderSummary cartMetadata={cartMetadata} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
