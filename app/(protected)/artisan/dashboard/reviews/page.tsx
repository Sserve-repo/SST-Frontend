import React from "react";
import { Metadata } from "next";
import ServiceReviewsPage from "@/components/reviews/service-reviews";

export const metadata: Metadata = {
  title: "Reviews | SphereServe",
};

const Reviews = () => {
  return (
    <>
      <ServiceReviewsPage />
    </>
  );
};

export default Reviews;
