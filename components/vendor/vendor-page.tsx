"use client";

import { Suspense, useEffect, useState } from "react";
import { DashboardStats } from "./stats";
import { RecentActivities } from "./recent-activities";
import { QuickActions } from "./quick-actions";
import { DashboardHeader } from "./header";
import { DashboardSkeleton } from "./skeleton";
import { SalesAnalytics } from "./orders/sales-analytics";
import { getVendorAnalytics } from "@/actions/dashboard/vendors";
import {
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  Truck,
} from "lucide-react";

export default function VendorPage() {
  const [analytics, setAnalytics] = useState<any>({});

  const handleFetchAnalytics = async () => {
    try {
      const response = await getVendorAnalytics();
      if (!response?.ok) {
        throw Error("Cannot fetch analytics data");
      }
      const data = await response.json();
      const transformedAnalytics = [
        {
          title: "Total Sales",
          value: `$${data?.data?.totalSales}`,
          icon: TrendingUp,
          color: "text-green-500",
          bgColor: "bg-green-50",
        },
        {
          title: "Active Listings",
          value: data?.data?.activeListings,
          icon: Package,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
        },
        {
          title: "Complete Order",
          value: `$${data?.data?.completeOrder}`,
          trend: "up",
          icon: DollarSign,
          color: "text-purple-500",
          bgColor: "bg-purple-50",
        },
        {
          title: "Pending Order",
          value: data?.data?.pendingOrder,
          icon: ShoppingCart,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
        },
        {
          title: "Order In Transit",
          value: data?.data?.orderInTransit,
          icon: Truck,
          color: "text-red-500",
          bgColor: "bg-red-50",
        },
      ];
      setAnalytics({ ...data.data, stats: transformedAnalytics });
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
          <DashboardStats analytics={analytics} />
          <QuickActions />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-9">
            <div className="md:col-span-1 lg:col-span-6">
              <SalesAnalytics analytics={analytics} />
            </div>
            <div className="md:col-span-1 lg:col-span-3">
              <RecentActivities />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
