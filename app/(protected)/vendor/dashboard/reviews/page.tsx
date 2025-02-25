import ReviewsPage from "@/components/reviews/reviews-page";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews | SphereServe",
};

const Reviews = () => {
  return (
    <>
      <ReviewsPage />
    </>
  );
};

export default Reviews;
