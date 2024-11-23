import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const OrderSummary = ({
  promoCode,
  setPromoCode,
  isSubmitting,
  handleApplyCoupon,
  handleSubmit,
}) => {
  const { cart, totalPrice } = useCart();
  const [isCheckoutPage, setIsCheckoutPage] = useState(false);

  useEffect(() => {
    setIsCheckoutPage(window.location.pathname === "/checkout");
  }, []);

  return (
    <div className="bg-gray-100 shadow-md p-6 rounded-lg sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>

      {/* List of items in the cart */}
      <div className="mb-4 space-y-2">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.name} (x{item.quantity} @ ${item.price})
            </span>
            <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Total Items and Price */}
      <div className="flex justify-between mb-2">
        <span>Sub Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      {/* Shipping */}
      <div className="flex justify-between mb-2">
        <span>Shipping:</span>
        <span>Free</span>
      </div>

      {/* Grand Total */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Dynamic Button */}
      {isCheckoutPage ? (
        <Button
          onClick={handleSubmit}
          className="w-full mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      ) : (
        <Link href="/checkout">
          <Button className="w-full mt-6">Proceed to Checkout</Button>
        </Link>
      )}

      {/* Promo Code Section */}
      <div className="mt-6">
        <div className="mt-8 flex items-center justify-center">
          <hr className="w-full border-t border-gray-300" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* Promo Code Input */}
          <div className="sm:col-span-2">
            <Label htmlFor="promo-code">Promo Code</Label>
            <Input
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
          </div>

          {/* Apply Button */}
          <div className="sm:col-span-1">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
