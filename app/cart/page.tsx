"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import OrderSummary from "./_components/OrderSummary";
import CartItem from "./CartItem";
import { toast } from "sonner";
// import { toast } from "@/hooks/use-toast";

const CartPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cart } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const handleApplyCoupon = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    console.log("Coupon applied successfully", cart);
    toast.success("Coupon applied successfully");
  };

  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    console.log("Order placed!", cart);
    toast.success("Order Placed", {
      description: "Your order has been successfully placed.",
    });
  };

  if (cart.length === 0) {
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
        <CartItem />
        <div>
          <OrderSummary
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            isSubmitting={isSubmitting}
            handleApplyCoupon={handleApplyCoupon}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
