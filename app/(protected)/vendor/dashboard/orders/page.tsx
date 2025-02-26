
import React from "react";
import { Metadata } from "next";
import OrdersPage from "@/components/vendor/orders/order-page";

export const metadata: Metadata = {
  title: "Orders | SphereServe",
};

const Orders = () => {
  return (
    <>
      <OrdersPage />
    </>
  );
};

export default Orders;
