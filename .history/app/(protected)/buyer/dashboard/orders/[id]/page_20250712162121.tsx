import { Metadata } from "next";
import OrdersPage from "./_components/Order";
import OrdersDetailPage from "./_components/Order";

export const metadata: Metadata = {
  title: "Orders | SphereServe",
};

export default function OrderDetail() {
  return (
    <>
      <OrdersDetailPage />
    </>
  );
}
