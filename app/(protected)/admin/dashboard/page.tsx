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
import { UserGrowthChart } from "@/components/admin/user-growth-chart";
import { TopServices } from "@/components/admin/top-services";
import { RecentActivity } from "@/components/admin/recent-activity";
import { QuickActions } from "@/components/admin/quick-actions";

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

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <UserGrowthChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2 lg:col-span-3">
          <QuickActions />
          <TopServices />
        </div>
      </div>
    </div>
  );
}
