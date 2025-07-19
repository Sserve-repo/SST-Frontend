import { Suspense } from "react";
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
import { CardSkeleton, ChartSkeleton } from "@/components/lazy-components";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      <Suspense fallback={<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>}>
        <StatsOverview />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>
              Your revenue over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <RevenueChart />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>
              Your most popular services this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>}>
              <TopServices />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Your best-selling products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>}>
              <TopProducts />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your business efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>}>
              <QuickActions />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
