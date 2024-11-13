import React from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="md:col-span-2 lg:col-span-2 pr-0 lg:pr-4 mx-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.map((item) => (
        <div key={item.id} className="flex items-center border-b py-4">
          <Link href={`/products/${item.id}`}>
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded object-cover mr-4"
            />
          </Link>
          <div className="flex-grow">
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-gray-600">${item.price.toFixed(2)}</p>
            <div className="flex items-center mt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-2">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="ml-4"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItem;
