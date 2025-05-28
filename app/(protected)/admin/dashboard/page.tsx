"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsOverview } from "@/components/admin/stats-overview";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { TopServices } from "@/components/admin/top-services";
import { QuickActions } from "@/components/admin/quick-actions";
import { TopProducts } from "@/components/admin/top-products";

export default function AdminDashboard() {
  return (
    <div className="py-2 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&#39;s what&#39;s happening today.
        </p>
      </div>

      <StatsOverview />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Overview spans 4 of 7 columns on large screens */}
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Daily revenue for the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        {/* Quick Actions spans 3 of 7 columns on large screens */}
        <Card className="md:col-span-2 lg:col-span-3">
          <QuickActions />
        </Card>
      </div>

      <div className=" grid gap-6 md:grid-cols-2 md:col-span-2 lg:col-span-3 justify-between py-4">
        <TopProducts />
        <TopServices />
      </div>
    </div>
  );
}
