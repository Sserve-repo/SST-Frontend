import React from "react";
import { Metadata } from "next";
import VendorPage from "@/components/vendor/vendor-page";

export const metadata: Metadata = {
  title: "Vendor | SphereServe",
};

const Vendor = () => {
  return (
    <>
      <VendorPage />
    </>
  );
};

export default Vendor;
