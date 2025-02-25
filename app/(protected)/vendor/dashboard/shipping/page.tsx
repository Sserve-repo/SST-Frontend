import React from "react";
import { Metadata } from "next";
import ShippingPage from "@/components/vendor/shipping/shipping-page";

export const metadata: Metadata = {
  title: "Shipping | SphereServe",
};

const Shipping = () => {
  return (
    <>
      <ShippingPage />
    </>
  );
};

export default Shipping;
