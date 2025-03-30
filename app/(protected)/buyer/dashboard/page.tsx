import BuyerPage from "@/components/buyer/buyer-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer | SphereServe",
};

const Buyer = () => {
  return <BuyerPage />;
};

export default Buyer;
