import { Metadata } from "next";
import DiscountsPage from "./Discounts";

export const metadata: Metadata = {
  title: "Discounts | SphereServe",
};

export default function Order() {
  return (
    <>
      <DiscountsPage />
    </>
  );
}
