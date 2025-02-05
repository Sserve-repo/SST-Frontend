"use client";

import { useCallback, useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order, OrderStatus } from "@/types/order";
import {
  Package,
  Clock,
  XCircle,
  Users,
  DollarSign,
  ShoppingCart,
  Hammer,
} from "lucide-react";
import type { OrderMetrics } from "@/types/order";
import { RoleMetrics } from "@/components/dashboard/orders/role-metrics";
import { RoleTable } from "@/components/dashboard/orders/role-table";
import { OrderDetails } from "@/components/dashboard/orders/order-details";

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState<OrderMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchOrders = useCallback(async () => {
    if (!currentUser?.user_type) return;

    setIsLoading(true);
    try {
      // Simulate API call with role-specific data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Different mock data based on user role
      const mockOrders: Order[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        orderNo: `ORD${96459761 + i}`,
        customerName: currentUser.user_type !== "2" ? "John Doe" : undefined,
        vendorName: currentUser.user_type === "2" ? "Store Name" : undefined,
        artisanName: currentUser.user_type === "2" ? "Artisan Name" : undefined,
        date: new Date().toLocaleDateString(),
        items: [
          { name: "Product 1", quantity: 2, price: 599 },
          { name: "Product 2", quantity: 1, price: 24 },
        ],
        total: 1222.0,
        status:
          i % 4 === 0
            ? "pending"
            : i % 4 === 1
            ? "delivered"
            : i % 4 === 2
            ? "in-transit"
            : "cancelled",
        shipping: 15.0,
        tax: 5.0,
        activities: [
          {
            message: "Order placed",
            date: "2024-02-04 10:00 AM",
            icon: "📦",
          },
        ],
        // Add custom order details for artisans
        isCustomOrder: currentUser.user_type === "4" && i % 3 === 0,
        customOrderDetails:
          currentUser.user_type === "4" && i % 3 === 0
            ? {
                specifications: "Custom design with intricate patterns",
                timeline: "2 weeks",
                materials: ["Wood", "Metal", "Glass"],
              }
            : undefined,
      }));

      setOrders(mockOrders);

      // Set role-specific metrics
      setMetrics({
        totalOrders: {
          value: 150,
          trend: 12.5,
          trendText: "vs. last month",
          icon: Package,
          label: "Total Orders",
          color: { text: "text-purple-500", bg: "bg-purple-50" },
        },
        completedOrders: {
          value: 89,
          trend: 8.2,
          trendText: "vs. last month",
          icon: Clock,
          label: "Completed Orders",
          color: { text: "text-emerald-500", bg: "bg-emerald-50" },
        },
        pendingOrders: {
          value: 42,
          trend: -2.1,
          trendText: "vs. last month",
          icon: Clock,
          label: "Pending Orders",
          color: { text: "text-orange-500", bg: "bg-orange-50" },
        },
        cancelledOrders: {
          value: 19,
          trend: -5.4,
          trendText: "vs. last month",
          icon: XCircle,
          label: "Cancelled Orders",
          color: { text: "text-red-500", bg: "bg-red-50" },
        },
        ...(currentUser?.user_type !== "2"
          ? {
              totalCustomers: {
                value: 2103,
                trend: 4.3,
                trendText: "vs. last month",
                icon: Users,
                label: "Total Customers",
                color: { text: "text-blue-500", bg: "bg-blue-50" },
              },
              totalEarnings: {
                value: "$15,891.05",
                trend: 8.2,
                trendText: "vs. last month",
                icon: DollarSign,
                label: "Total Earnings",
                color: { text: "text-green-500", bg: "bg-green-50" },
              },
              averageOrderValue: {
                value: "$105.94",
                trend: 6.7,
                trendText: "vs. last month",
                icon: ShoppingCart,
                label: "Average Order Value",
                color: { text: "text-indigo-500", bg: "bg-indigo-50" },
              },
            }
          : {}),
        ...(currentUser?.user_type === "4"
          ? {
              customOrdersReceived: {
                value: 45,
                trend: 15.7,
                trendText: "vs. last month",
                icon: Hammer,
                label: "Custom Orders Received",
                color: { text: "text-pink-500", bg: "bg-pink-50" },
              },
              customOrdersCompleted: {
                value: 38,
                trend: 12.3,
                trendText: "vs. last month",
                icon: Hammer,
                label: "Custom Orders Completed",
                color: { text: "text-cyan-500", bg: "bg-cyan-50" },
              },
            }
          : {}),
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.user_type]);

  useEffect(() => {
    handleFetchOrders();
  }, [handleFetchOrders]);

  const handleStatusChange = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    },
    []
  );

  const handleAcceptOrder = useCallback(
    async (orderId: string) => {
      await handleStatusChange(orderId, "in-transit");
    },
    [handleStatusChange]
  );

  const handleRejectOrder = useCallback(
    async (orderId: string) => {
      await handleStatusChange(orderId, "cancelled");
    },
    [handleStatusChange]
  );

  if (!currentUser?.user_type) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {currentUser.user_type === "2"
            ? "My Orders"
            : currentUser.user_type === "3"
            ? "Orders Management"
            : "Custom Orders"}
        </h1>
      </div>

      {metrics && (
        <RoleMetrics metrics={metrics} userType={currentUser.user_type} />
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl border">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">Filter By</span>
          </div>

          <div className="flex flex-wrap gap-4 flex-1">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Custom filter for artisans */}
            {currentUser.user_type === "4" && (
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="custom">Custom Orders</SelectItem>
                  <SelectItem value="standard">Standard Orders</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white">
          <RoleTable
            orders={orders}
            userType={currentUser.user_type}
            onViewDetails={setSelectedOrder}
          />

          <div className="flex items-center justify-between px-4 py-4">
            <p className="text-sm text-muted-foreground">
              Showing 1-10 of {orders.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetails
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          userType={currentUser.user_type}
          onStatusChange={handleStatusChange}
          onAcceptOrder={handleAcceptOrder}
          onRejectOrder={handleRejectOrder}
        />
      )}
    </div>
  );
}
