import Link from "next/link";
import { pathOr } from "ramda";
import React from "react";
import { MdArrowBack } from "react-icons/md";
import SectionProductHeader from "./SectionServiceHeader";
import { products } from "@/lib/content";
import { Button } from "@/components/ui/button";

type Props = {
  params: { serviceId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const getServiceData = async (id: string) => {
  return products.find((item) => item.slug === id);
};

const SingleServicePage = async (props: Props) => {
  const selectedService = await getServiceData(props.params.serviceId);

  return (
    <div className="container relative md:my-32 sm:my-28 my-24 mx-auto px-4">
      <Link href="/services" className="flex gap-1 text-sm mb-1 w-fit">
        <MdArrowBack className="text-xl" />
        <p>Back to search results</p>
      </Link>

      <div className="mb-24">
        <SectionProductHeader
          images={pathOr([], ["images"], selectedService)}
          productName={pathOr("", ["productName"], selectedService)}
          price={pathOr(0, ["price"], selectedService)}
          reviews={pathOr(0, ["reviews"], selectedService)}
          description={pathOr("", ["description"], selectedService)}
          slug={pathOr("", ["slug"], selectedService)}
          id={pathOr("", ["id"], selectedService)}
          rating={pathOr(0, ["rating"], selectedService)}
          discountedPrice={pathOr(0, ["discountedPrice"], selectedService)}
          discount={pathOr(0, ["discount"], selectedService)}
          features={pathOr([], ["features"], selectedService)}
          specifications={pathOr([], ["specifications"], selectedService)}
          seller={pathOr("", ["seller"], selectedService)}
          estimatedDelivery={pathOr("", ["estimatedDelivery"], selectedService)}
          returnPolicy={pathOr("", ["returnPolicy"], selectedService)}
        />
      </div>

      <div className="mb-16">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-6">Related Services</h2>
          <Link href="/services">
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
              <Link href={`/services/${item.slug}`}>
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

export default SingleServicePage;
