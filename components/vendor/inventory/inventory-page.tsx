"use client";

import { Suspense, useEffect, useState } from "react";
import { InventoryHeader } from "./header";
import { InventoryOverview } from "./overview";
import { InventoryTable } from "./table";
import { InventoryTableSkeleton } from "./table-skeleton";
import type { Product } from "@/types";
import { getInventoryItems } from "@/actions/dashboard/vendors";
import { useToast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<Product[]>([]);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleFetchInventoryItems = async () => {
    try {
      setLoading(true);
      const response = await getInventoryItems();

      if (!response?.ok) {
        throw new Error("Cannot fetch inventory data");
      }

      const data = await response.json();

      if (
        !data?.data?.productListing ||
        !Array.isArray(data.data.productListing)
      ) {
        console.warn("Invalid product listing data structure");
        setInventoryItems([]);
        return;
      }

      console.log("Fetched inventory items:", data);

      // Transform the fetched items properly
      const transformedItems: Product[] = data.data.productListing.map(
        (item: any) => ({
          id: String(item?.id || ""),
          name: item?.title || "Unnamed Product",
          sku: `SKU-${String(item?.id || Math.random()).padStart(6, "0")}`,
          category: item?.category?.name || "Misc",
          subCategory: item?.subCategory?.name || "General",
          category_id: item?.category?.id || item?.category_id,
          sub_category_id: item?.subCategory?.id || item?.sub_category_id,
          price: Number(item?.price) || 0,
          stock: Number(item?.stock_level) || 0,
          stock_level: Number(item?.stock_level) || 0,
          threshold: Number(item?.threshold) || 5,
          status: item?.status === 1 ? "published" : "draft",
          lastUpdated: item?.updated_at || new Date().toISOString(),
          updated_at: item?.updated_at || new Date().toISOString(),
          description: item?.description || "No description available",
          images: Array.isArray(item?.product_images)
            ? item.product_images.map((img: any) => img.image || img)
            : item?.image
            ? [item.image]
            : ["/placeholder.svg?height=200&width=200"],
          image: Array.isArray(item?.product_images)
            ? item.product_images.map((img: any) => img.image || img)
            : item?.image
            ? [item.image]
            : ["/placeholder.svg?height=200&width=200"],
          shippingCost: Number(item?.shipping_cost) || 0,
          shipping_cost: Number(item?.shipping_cost) || 0,
          product_images: Array.isArray(item?.product_images)
            ? item.product_images.map((img: any) => img.image || img)
            : item?.image
            ? [item.image]
            : ["/placeholder.svg?height=200&width=200"],
          title: item?.title || "Unnamed Product",
        })
      );

      setInventoryItems(transformedItems);
      setOverview(data?.data?.topOverview || {});
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory items. Please try again.",
        variant: "destructive",
      });
      setInventoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchInventoryItems();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        </div>
        <InventoryTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600 mt-1">
            Manage your product inventory ({inventoryItems.length} items)
          </p>
        </div>
      </div>

      <InventoryHeader
        setInventoryItems={setInventoryItems}
        onRefresh={handleFetchInventoryItems}
      />
      <InventoryOverview overview={overview} />
      <Suspense fallback={<InventoryTableSkeleton />}>
        <InventoryTable
          inventoryItems={inventoryItems}
          onUpdate={handleFetchInventoryItems}
        />
      </Suspense>
    </div>
  );
}
