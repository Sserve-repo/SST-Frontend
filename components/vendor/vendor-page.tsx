"use client";

import { Suspense, useEffect, useState } from "react";
import { DashboardStats } from "./stats";
import { DashboardHeader } from "./header";
import { DashboardSkeleton } from "./skeleton";
import { SalesAnalytics } from "./orders/sales-analytics";
import { TopProducts } from "./analytics/top-products";
// import { TopCustomers } from "./analytics/top-customers";
import { LatestOrders } from "./analytics/latest-orders";
import { LatestReviews } from "./analytics/latest-reviews";
// import { RecentProductsOrdered } from "./analytics/recent-products-ordered";
import { getVendorAnalytics } from "@/actions/dashboard/vendors";
import { TrendingUp, Package, ShoppingCart, Truck, Box } from "lucide-react";

export default function VendorPage() {
  const [analytics, setAnalytics] = useState<any>({});
  const [statistics, setStatistics] = useState<any>([]);

  const handleFetchAnalytics = async () => {
    try {
      const response = await getVendorAnalytics();
      if (!response?.ok) throw Error("Cannot fetch analytics data");

      const data = await response.json();

      const d = data.data;

      // Build the summary statistics array
      const transformedAnalytics = [
        {
          title: "Total Sales",
          value: `$${d.totalSales}`,
          icon: TrendingUp,
          color: "text-green-500",
          bgColor: "bg-green-50",
        },
        {
          title: "Active Listings",
          value: d.activeListings,
          icon: Package,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
        },
        {
          title: "Complete Order",
          value: `${d.completeOrder}`,
          trend: "up",
          icon: Box,
          color: "text-purple-500",
          bgColor: "bg-purple-50",
        },
        {
          title: "Pending Order",
          value: d.pendingOrder,
          icon: ShoppingCart,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
        },
        {
          title: "Order In Transit",
          value: d.orderInTransit,
          icon: Truck,
          color: "text-red-500",
          bgColor: "bg-red-50",
        },
      ];

      // Extract nested analytics objects with exact keys
      const analytics = {
        ...d.Analytics, // topProducts, orderTrends, revenueStats
        latestOrders: d["Latest Orders"]?.latestOrders || [],
        latestReviews: d["Latest Reviews"]?.latestReviews || [],
        recentProducts: d.RecentProductOrdered || [],
        topCustomers: d.TopCustomers || [],
        topProductOrdered: d.TopProductOrdered || [],
      };

      setStatistics(transformedAnalytics);
      setAnalytics(analytics);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <DashboardHeader />
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid gap-6">
          <DashboardStats statistics={statistics} />

          {/* Main Analytics Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2 lg:col-span-2">
              <SalesAnalytics analytics={analytics} />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
              <LatestReviews reviews={analytics?.latestReviews || []} />
            </div>
          </div>

          {/* Secondary Analytics Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* <TopCustomers customers={analytics?.TopCustomers || []} /> */}
            <LatestOrders orders={analytics?.latestOrders || []} />
            <TopProducts products={analytics?.topProducts || []} />
            {/* <LatestReviews reviews={analytics?.latestReviews || []} /> */}
          </div>

          {/* Recent Products Section */}
          <div className="grid gap-6">
            {/* <RecentProductsOrdered
              products={analytics?.RecentProductOrdered || []}
            /> */}
          </div>
        </div>
      </Suspense>
    </div>
  );
}
