import { ArtisansPage } from "@/components/artisan/artisans-page";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisan | SphereServe",
};

const Artisan = () => {
  return (
    <>
      <ArtisansPage />
    </>
  );
};

export default Artisan;
