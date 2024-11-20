import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const OrderSummary = () => {
  const { cart, totalPrice } = useCart();

  return (
    <div className="bg-gray-100 shadow-md p-6 rounded-lg sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* List of items in the cart */}
      <div className="mb-4 space-y-2">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
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

      {/* Proceed to Checkout Button */}
      <Link href="/checkout">
        <Button className="w-full mt-6">Proceed to Checkout</Button>
      </Link>
    </div>
  );
};

export default OrderSummary;
