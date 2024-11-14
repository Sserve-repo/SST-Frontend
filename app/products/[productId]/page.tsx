import Link from "next/link";
import { pathOr } from "ramda";
import React from "react";
import { MdArrowBack } from "react-icons/md";
import SectionProductHeader from "./SectionProductHeader";
import { products } from "@/lib/content";
import { Button } from "@/components/ui/button";

type Props = {
  params: { productId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const getProductData = async (id: string) => {
  return products.find((item) => item.slug === id);
};

const SingleProductPage = async (props: Props) => {
  const selectedProduct = await getProductData(props.params.productId);

  return (
    <div className="container relative md:my-32 sm:my-28 my-24 mx-auto px-4">
      <Link href="/products" className="flex gap-1 text-sm mb-1 w-fit">
        <MdArrowBack className="text-xl" />
        <p>Back to search results</p>
      </Link>

      <div className="mb-24">
        <SectionProductHeader
          images={pathOr([], ["images"], selectedProduct)}
          productName={pathOr("", ["productName"], selectedProduct)}
          price={pathOr(0, ["price"], selectedProduct)}
          reviews={pathOr(0, ["reviews"], selectedProduct)}
          description={pathOr("", ["description"], selectedProduct)}
          slug={pathOr("", ["slug"], selectedProduct)}
          id={pathOr("", ["id"], selectedProduct)}
          rating={pathOr(0, ["rating"], selectedProduct)}
          discountedPrice={pathOr(0, ["discountedPrice"], selectedProduct)}
          discount={pathOr(0, ["discount"], selectedProduct)}
          features={pathOr([], ["features"], selectedProduct)}
          specifications={pathOr([], ["specifications"], selectedProduct)}
          seller={pathOr("", ["seller"], selectedProduct)}
          estimatedDelivery={pathOr("", ["estimatedDelivery"], selectedProduct)}
          returnPolicy={pathOr("", ["returnPolicy"], selectedProduct)}
        />
      </div>

      <div className="mb-16">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
          <Link href="/products">
            <Button variant={"outline"} className="text-sm rounded-full text-primary">View all</Button>
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
