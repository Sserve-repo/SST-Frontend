"use client";

import Link from "next/link";
import { pathOr } from "ramda";
import React, { useCallback, useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import SectionProductHeader from "./SectionProductHeader";
import { products } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { getSingleProduct } from "@/actions/product";
import { useRouter } from "next/navigation";

type Props = {
  params: { productId: number };
  searchParams: { [key: string]: string | string[] | undefined };
};

const SingleProductPage = ({ params }: Props) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProductData = useCallback(
    async (id: number) => {
      try {
        const response = await getSingleProduct(id);
        if (response?.ok) {
          const data = await response.json();
          const productData = data.data["Products Items"];
          setSelectedProduct({ ...productData, images: [productData.image] });
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    },
    [router, setSelectedProduct, setIsLoading]
  );

  useEffect(() => {
    fetchProductData(params.productId);
  }, [params.productId, fetchProductData]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!selectedProduct) {
    // Fallback if product data is unavailable
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 relative my-24">
      <Link href="/products" className="flex gap-1 text-sm mb-1 w-fit">
        <MdArrowBack className="text-xl" />
        <span>Back to search results</span>
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

      {/* Related Products Section */}
      <div className="mb-16">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Related Products</h2>
          <Link href="/products">
            <Button
              variant="outline"
              className="text-sm rounded-full text-primary"
            >
              View all
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((item) => (
            <div key={item.slug} className="bg-white rounded-xl shadow-sm">
              <Link href={`/products/${item.slug}`}>
                <img
                  src={item.images[0]}
                  alt={item.productName}
                  className="w-full h-52 object-cover rounded-xl"
                />
                <h3 className="text-base mt-2 font-medium">
                  {item.productName}
                </h3>
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
