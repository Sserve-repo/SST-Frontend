"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const OrderSummary = ({ cartMetadata }) => {
  const { isAuthenticated } = useAuth();
  const { cart, totalPrice } = useCart();
  const [isCheckoutPage, setIsCheckoutPage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsCheckoutPage(window.location.pathname === "/checkout");
  }, [cart]);

  return (
    <div className="bg-gray-100 shadow-md p-6 rounded-lg sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>

      {/* List of items in the cart */}
      <div className="mb-4 space-y-2">
        {cart &&
          cart?.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item?.title} (x{item?.quantity} @ ${item?.unit_price})
              </span>
              <span>
                ${(parseFloat(item?.unit_price) * item?.quantity).toFixed(2)}
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
        <span>
          {(cartMetadata &&
            cartMetadata["Shipping Cost"] &&
            cartMetadata["Shipping Cost"].toFixed(2)) ||
            "Free"}{" "}
        </span>
      </div>

      {/* Tax */}
      <div className="flex justify-between mb-2">
        <span>Tax:</span>
        <span>
          $
          {cartMetadata &&
            cartMetadata["Tax Rate"] &&
            cartMetadata["Tax Rate"].toFixed(2)}{" "}
        </span>
      </div>

      {/* Grand Total */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${cartMetadata &&
            cartMetadata["Total Amount"] &&
            cartMetadata["Total Amount"].toFixed(2)}{" "}</span>
        </div>
      </div>

      {/* Dynamic Button */}
      {isCheckoutPage ? (
        <></>
      ) : (
        <Button
          onClick={() => {
            if (!isAuthenticated) {
              router.push("/auth/login?redirect=checkout");
            } else {
              router.push("/checkout");
            }
          }}
          className="w-full mt-6"
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
};

export default OrderSummary;
