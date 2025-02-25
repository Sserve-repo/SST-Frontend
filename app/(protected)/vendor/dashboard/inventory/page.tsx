import React from "react";
import { Metadata } from "next";
import InventoryPage from "@/components/vendor/inventory/inventory-page";

export const metadata: Metadata = {
  title: "Inventory | SphereServe",
};

const Inventory = () => {
  return (
    <>
      <InventoryPage />
    </>
  );
};

export default Inventory;
