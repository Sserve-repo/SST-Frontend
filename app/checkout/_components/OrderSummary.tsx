import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

const OrderSummary = ({ register, errors }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
          <CreditCard className="w-4 h-4 mr-2" />
          <span>Secure payment powered by Stripe</span>
        </div>
        <Button
          type="submit"
          form="checkout-form"
          className="w-full mt-4 py-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Proceed to Checkout"}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
