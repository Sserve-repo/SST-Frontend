import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OrderSummary = ({
  promoCode,
  setPromoCode,
  isSubmitting,
  handleApplyCoupon,
  handleSubmit,
}) => {
  return (
    <div className="bg-gray-100 shadow-md p-4  rounded-lg sticky top-4 gap-y-8">
      <div className="grid grid-cols-1 ">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$99.99</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$9.99</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>$10.00</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>$119.98</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500"></div>
        <Button
          type="submit"
          form="checkout-form"
          className="w-full mt-4 py-6"
          disabled={isSubmitting}
          onClick={() => handleSubmit()}
        >
          {isSubmitting ? "Processing..." : "Proceed to Checkout"}
        </Button>
      </div>

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
