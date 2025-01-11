"use client";

import Link from "next/link";
import { pathOr } from "ramda";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { MdArrowBack } from "react-icons/md";
import SectionProductHeader from "./SectionProductHeader";
import { Button } from "@/components/ui/button";
import { getProductByCategorySub, getSingleProduct } from "@/actions/product";
import { useRouter } from "next/navigation";

type Props = {
  params: { productId: number };
  searchParams: { [key: string]: string | string[] | undefined };
};

const SingleProductPage = ({ params }: Props) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const router = useRouter();

  const fetchProductData = useCallback(
    async (id: number) => {
      try {
        const response = await getSingleProduct(id);
        if (response?.ok) {
          const data = await response.json();
          const productData = data.data["Products Items"];
          setSelectedProduct({ ...productData, images: [productData.image] });
          fetchRelatedProducts(
            productData.product_category_id,
            productData.product_category_items_id
          );
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

  const fetchRelatedProducts = async (
    categoryId: number,
    subcategoryId: number
  ) => {
    try {
      const response = await getProductByCategorySub({
        product_category: categoryId,
        product_subcategory: subcategoryId,
        limit: 4,
        page: 1,
      });
      if (response?.ok) {
        const data = await response.json();
        setRelatedProducts(data.product_listing || []);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

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
    <div className="container mx-auto px-4 relative my-32">
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
      {relatedProducts.length > 0 && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Related Products</h2>
            <Link href="/products">
              <Button variant="outline" className="rounded-full">
                View all
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-orange-400 mt-1">
                      {product.seller || "Business name"}
                    </p>
                    <p className="text-primary font-semibold text-xl mt-2">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProductPage;
