"use client"

import { useState } from "react"
import { DateRangePicker } from "@/components/admin/analytics/date-range-picker"
import { OverviewMetrics } from "@/components/admin/analytics/overview-metrics"
import { RevenueChart } from "@/components/admin/analytics/revenue-chart"
import { UserGrowthChart } from "@/components/admin/analytics/user-growth-chart"
import { ServiceBreakdown } from "@/components/admin/analytics/service-breakdown"
import { EngagementMetrics } from "@/components/admin/analytics/engagement-metrics"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportToCSV } from "@/lib/export"
import type { DateRange } from "react-day-picker"
import type { AnalyticsData } from "@/types/analytics"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  // Sample analytics data - In a real app, this would come from an API
  const analyticsData: AnalyticsData = {
    overview: {
      totalRevenue: 124500,
      totalOrders: 1234,
      totalUsers: 5678,
      averageOrderValue: 100.89,
      totalBookings: 0,
      averageRating: 0,
      conversionRate: 0
    },
    revenue: {
      total: 124500,
      growth: 12.5,
      monthly: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
        revenue: Math.floor(Math.random() * 20000) + 5000,
      })),
    },
    users: {
      total: 5678,
      growth: 8.3,
      monthly: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
        users: Math.floor(Math.random() * 500) + 100,
      })),
    },
    services: [
      { name: "Hair Styling", revenue: 45000, orders: 450 },
      { name: "Nail Car e", revenue: 30000, orders: 300 },
      { name: "Massage", revenue: 25000, orders: 250 },
      { name: "Makeup", revenue: 24500, orders: 234 },
    ] as any,
    engagement: {
      activeUsers: 2345,
      sessionDuration: "12m 30s",
      bounceRate: "23.5%",
      returnRate: "68.2%",
    },
  }

  const handleExport = () => {
    const data = [
      // Revenue data
      ...analyticsData.revenue.monthly.map((month) => ({
        Month: month.month,
        Revenue: `$${month.revenue}`,
        Users: analyticsData.users.monthly.find((m) => m.month === month.month)?.users || 0,
      })),
    ]

    exportToCSV(data, "analytics-report.csv")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Analytics & Reports</h1>
          <p className="text-muted-foreground">Track your business performance and growth</p>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <OverviewMetrics data={analyticsData.overview} />

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart data={analyticsData.revenue} />
        <UserGrowthChart data={analyticsData.users} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ServiceBreakdown services={analyticsData.services as any} />
        <EngagementMetrics data={analyticsData.engagement as any} />
      </div>
    </div>
  )
}

