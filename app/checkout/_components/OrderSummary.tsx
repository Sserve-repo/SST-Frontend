"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const OrderSummary = () => {
  const { cart, shippingCost, taxRate, totalPrice } = useCart();
  const [isCheckoutPage, setIsCheckoutPage] = useState(false);

  useEffect(() => {
    setIsCheckoutPage(window.location.pathname === "/checkout");
  }, []);

  return (
    <div className="bg-gray-100 shadow-md p-6 rounded-lg sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>

      {/* List of items in the cart */}
      <div className="mb-4 space-y-2">
        {cart &&
          cart?.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} (x{item.quantity} @ ${item.unit_price})
              </span>
              <span>
                ${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
      </div>

      {/* Total Items and Price */}
      <div className="flex justify-between mb-2">
        <span>Sub Total:</span>
        <span>${totalPrice?.toFixed(2)}</span>
      </div>

      {/* Shipping */}
      <div className="flex justify-between mb-2">
        <span>Shipping:</span>
        <span>{shippingCost ? shippingCost : "Free"} </span>
      </div>

      {/* Tax */}
      <div className="flex justify-between mb-2">
        <span>Tax:</span>
        <span>${taxRate && taxRate.toFixed(2)} </span>
      </div>

      {/* Grand Total */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${totalPrice?.toFixed(2)}</span>
        </div>
      </div>

      {/* Dynamic Button */}
      {isCheckoutPage ? (
        <></>
      ) : (
        <Link href="/checkout">
          <Button className="w-full mt-6">Proceed to Checkout</Button>
        </Link>
      )}

      {/* Promo Code Section */}
      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* Promo Code Input */}
          {/* <div className="sm:col-span-2">
            <Label htmlFor="promo-code">Promo Code</Label>
            <Input
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
          </div> */}

          {/* Apply Button */}
          {/* <div className="sm:col-span-1">

            <Label htmlFor="apply-button" className="sr-only">
              Apply
            </Label>
            <Button
              type="button"
              onClick={handleApplyCoupon}
              className="w-full py-6 mt-1 text-white rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Apply"}
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
