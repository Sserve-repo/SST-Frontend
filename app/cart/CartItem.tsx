import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RiDeleteBinLine } from "react-icons/ri";

const CartItem = ({ products, setProducts }) => {
  const handleQuantityChange = (id, change) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: Math.max(1, (product.quantity || 1) + change),
            }
          : product
      )
    );
  };

  const setHandleRemoveProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <div className="lg:col-span-2 pr-0 lg:pr-4 mx-6">
      {products.map((product, index) => (
        <div key={index}>
          <div className="mt-8 flex items-center justify-center py-3">
            <hr className="w-full border-t border-gray-300" />
          </div>
          <div className="flex gap-x-4 items-center">
            <div className="relative h-28 w-24">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-md "
              />
            </div>
            <div className="">
              <p className="font-bold">{product.name}</p>
              <p className="text-[#D3AFE4]">${product.price}</p>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <button
                    className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(product.id, -1)}
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-lg text-gray-800">
                    {product.quantity}
                  </span>
                  <button
                    className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(product.id, 1)}
                  >
                    +
                  </button>
                </div>
                <div>
                  <RiDeleteBinLine
                    className="text-[#502266]"
                    onClick={() => setHandleRemoveProduct(product.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItem;
