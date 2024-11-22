"use client";

import Link from "next/link";
import { pathOr } from "ramda";
import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import SectionProductHeader from "./SectionProductHeader";
import { products } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { getSingleProduct } from "@/fetchers/product";

type Props = {
  params: { productId: number };
  searchParams: { [key: string]: string | string[] | undefined };
};

const SingleProductPage = (props: Props) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getProductData = async (id: number) => {
    const response = await getSingleProduct(id);
    if (response?.ok) {
      const data = await response.json();
      const res = data.data["Products Items"];
      setSelectedProduct({ ...res, images: [res.image] });
    } else {
      console.error("Failed to fetch product data:", response?.statusText);
    }
  };

  useEffect(() => {
    getProductData(props.params.productId);
  }, []);

  return (
    <div className="container relative md:my-32 sm:my-28 my-24 mx-auto px-4">
      <Link href="/products" className="flex gap-1 text-sm mb-1 w-fit">
        <MdArrowBack className="text-xl" />
        <p>Back to search results</p>
      </Link>

      <div className="mb-24">
        <SectionProductHeader
          id={pathOr("", ["id"], selectedProduct)}
          images={pathOr([], ["images"], selectedProduct)}
          productName={pathOr("", ["title"], selectedProduct)}
          price={pathOr(0, ["price"], selectedProduct)}
          reviews={pathOr(0, ["reviews"], selectedProduct)}
          description={pathOr("", ["description"], selectedProduct)}
          slug={pathOr("", ["slug"], selectedProduct)}
          discount={pathOr(0, ["discount"], selectedProduct)}
          discountedPrice={pathOr(0, ["discountedPrice"], selectedProduct)}
          seller={pathOr("", ["seller"], selectedProduct)}
          specifications={pathOr([], ["specifications"], selectedProduct)}
          features={pathOr([], ["features"], selectedProduct)}
          rating={pathOr(0, ["rating"], selectedProduct)}
          estimatedDelivery={pathOr("", ["estimatedDelivery"], selectedProduct)}
          returnPolicy={pathOr("", ["returnPolicy"], selectedProduct)}
        />
      </div>

      <div className="mb-16">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
          <Link href="/products">
            <Button
              variant={"outline"}
              className="text-sm rounded-full text-primary"
            >
              View all
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((item) => (
            <div key={item.slug} className="bg-white rounded-xl ">
              <Link href={`/products/${item.slug}`}>
                <img
                  src={item.images[0]}
                  alt={item.productName}
                  className="w-full h-52 bg-center object-cover rounded-xl"
                />
                <h3 className="text-[1rem] mt-2">{item.productName}</h3>
                <p className="text-xs text-orange-400">Business name</p>
                <p className="text-primary font-semibold text-2xl mt-1">
                  ${item.price}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
