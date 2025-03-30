"use client"

import { Suspense, useEffect, useState } from "react";
import { InventoryHeader } from "./header";
import { InventoryOverview } from "./overview";
import { InventoryTable } from "./table";
import { InventoryTableSkeleton } from "./table-skeleton";
import { Product } from "@/types";
import { getInventoryItems } from "@/actions/dashboard/vendors";

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<Product[] | []>([]);

  const handleFetchInventoryItems = async () => {
    try {
      const response = await getInventoryItems();

      if (!response?.ok) {
        throw new Error("Cannot fetch analytics data");
      }

      const data = await response.json();

      if (
        !data?.data.productListing ||
        !Array.isArray(data.data.productListing)
      ) {
        throw new Error("Invalid product listing data");
      }

      // Transform the fetched items properly
      const transformedItems = data.data.productListing.map((item) => ({
        id: item?.id || "N/A",
        name: item?.title || "Unnamed Product",
        sku: `SKU-${parseInt(item?.id) * 1000}` || "UNKNOWN-SKU",
        category: item?.category?.name || "Misc",
        subCategory: item?.subCategory?.name || "General",
        price: item?.price || 0.0,
        stock: item?.stock_level || 0,
        threshold: item?.threshold || 5,
        status: item?.status || "draft",
        lastUpdated:
          item?.lastUpdated || new Date().toISOString().split("T")[0],
        description: item?.description || "No description available",
        images: item.images?.length
          ? item.images
          : item.image || ["/placeholder.svg"],
        image: item.image || ["/placeholder.svg"],
        shippingCost: item?.shippingCost || 0.0,
      }));

      setInventoryItems(transformedItems);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  useEffect(() => {
    handleFetchInventoryItems();
    console.log({ inventoryItems });
  }, []);

  return (
    <div className="space-y-6 p-4">
      <InventoryHeader
        setInventoryItems={setInventoryItems}
      />
      <InventoryOverview />
      <Suspense fallback={<InventoryTableSkeleton />}>
        <InventoryTable inventoryItems={inventoryItems} />
      </Suspense>
    </div>
  );
}
