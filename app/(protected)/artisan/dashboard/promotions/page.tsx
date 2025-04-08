import PromotionsPage from "@/components/artisan/promotions/promotions-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotions | SphereServe",
};

export default function Promotions() {
  return (
    <>
      <PromotionsPage />
    </>
  );
}
