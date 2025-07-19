import { VendorPromotionsPage } from "@/components/vendor/promotions/promotions-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotions | SphereServe",
};

export default function Promotions() {
  return (
    <>
      <VendorPromotionsPage />
    </>
  );
}
