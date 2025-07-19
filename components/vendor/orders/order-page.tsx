"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
// import { OrdersHeader } from "./header";
import { OrdersOverview } from "./overview";
import { OrdersTable } from "./table";
import { OrdersTableSkeleton } from "./table-skeleton";
import { getOrders } from "@/actions/dashboard/vendors";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const handleFetchOrders = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await getOrders();

        if (!response?.ok) {
          throw new Error("Error fetching orders");
        }

        const data = await response.json();

        console.log("Fetched orders data:", data);

        if (!data?.data) {
          console.warn("Invalid orders data structure");
          setOrders([]);
          return;
        }

        // Extract data properly
        const { Orders = [], ...Overview } = data.data;

        // Transform orders data
        const transformedOrders = Array.isArray(Orders)
          ? Orders.map((order: any) => ({
              id: String(order.id || ""),
              orderNumber: `ORD-${order.order_no || order.id}`,
              customer: {
                name:
                  `${order.customer?.firstname || ""} ${
                    order.customer?.lastname || ""
                  }`.trim() || "Unknown Customer",
                email: order.customer?.email || order.email || "",
                avatar: "/placeholder.svg?height=32&width=32",
              },
              date: order.created_at || new Date().toISOString(),
              total: Number(order.total) || 0,
              status: order.order_status || "pending",
              paymentStatus: order.status || "pending",
              items: Array.isArray(order.product_items)
                ? order.product_items.map((item: any) => ({
                    id: String(item.id || ""),
                    name: item.product_name || item.name || "Unknown Product",
                    price: Number(item.unit_price) || 0,
                    quantity: Number(item.quantity) || 1,
                  }))
                : [],
              shippingAddress: {
                line1: order.delivery_information?.address || "123 Main St",
                city: order.delivery_information?.city || "Unknown City",
                state: order.delivery_information?.state || "",
                zipCode: order.delivery_information?.postal_code || "",
                country: order.delivery_information?.country || "USA",
              },
              shippingMethod: "Standard Shipping",
            }))
          : [];

        setOrders(transformedOrders);
        setOverview(Overview);

        if (showRefreshLoader) {
          toast({
            title: "Success",
            description: "Orders refreshed successfully",
          });
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again.",
          variant: "destructive",
        });
        setOrders([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [toast]
  );

  const handleRefresh = () => {
    handleFetchOrders(true);
  };

  useEffect(() => {
    handleFetchOrders();
  }, [handleFetchOrders]);

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        </div>
        <OrdersTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your product orders ({orders.length} orders)
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* <OrdersHeader /> */}
      <OrdersOverview overview={overview} />

      <div className="w-full">
        <Suspense fallback={<OrdersTableSkeleton />}>
          <OrdersTable orders={orders} onRefresh={handleRefresh} />
        </Suspense>
      </div>
    </div>
  );
}
