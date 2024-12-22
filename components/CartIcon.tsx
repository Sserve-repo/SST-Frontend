"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

const CartIcon = () => {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-gray-600 hover:text-gray-900 inline-block"
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 text-xs"
        >
          {totalItems}
        </Badge>
      )}
    </Link>
  );
};

export default CartIcon;
