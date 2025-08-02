import { Metadata } from "next";
import Order from "./_components/Order";

export const metadata: Metadata = {
  title: "Orders | SphereServe",
};

export default function OrderDetail() {
  return (
    <>
      <Order />
    </>
  );
}
