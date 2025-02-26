"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/export";
import type { DateRange } from "react-day-picker";
import { AnalyticsData } from "@/types/analytics";
import { DateRangePicker } from "./date-range-picker";
import { TrafficChart } from "./traffic-chart";
import { ServiceAnalytics } from "./service-analytics";
import { EarningsOverview } from "./earnings-overview";
import { RevenueBreakdown } from "./revenue-breakdown";
import { DataTable } from "./data-table";
import { OverviewMetrics } from "./overview-metrics";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  // Sample analytics data - In a real app, this would come from an API
  const analyticsData: AnalyticsData = {
    overview: {
      totalBookings: 156,
      totalRevenue: 7840,
      averageRating: 4.8,
      conversionRate: 68,
    },
    traffic: {
      pageViews: 2345,
      uniqueVisitors: 1234,
      sources: [
        { source: "Direct", value: 40 },
        { source: "Search", value: 30 },
        { source: "Social", value: 20 },
        { source: "Referral", value: 10 },
      ],
      dailyVisitors: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
        visitors: Math.floor(Math.random() * 100) + 50,
        pageViews: Math.floor(Math.random() * 200) + 100,
      })),
    },
    services: {
      totalServices: 8,
      activeServices: 6,
      serviceBreakdown: [
        { name: "Haircut & Styling", bookings: 45, revenue: 2250 },
        { name: "Hair Coloring", bookings: 32, revenue: 3840 },
        { name: "Manicure", bookings: 28, revenue: 980 },
        { name: "Pedicure", bookings: 24, revenue: 840 },
      ],
    },
    earnings: {
      total: 7840,
      pending: 1200,
      paid: 6640,
      monthly: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString("default", {
          month: "short",
        }),
        earnings: Math.floor(Math.random() * 2000) + 500,
      })),
    },
  };

  const handleExport = () => {
    const data = [
      ...analyticsData.services.serviceBreakdown.map((service) => ({
        "Service Name": service.name,
        "Total Bookings": service.bookings,
        Revenue: `$${service.revenue}`,
      })),
    ];

    exportToCSV(data, "analytics-report.csv");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Analytics & Reports
          </h1>
          <p className="text-gray-500">
            Track your business performance and growth
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <OverviewMetrics data={analyticsData.overview} />

      <div className="grid gap-6 md:grid-cols-2">
        <TrafficChart data={analyticsData.traffic} />
        <ServiceAnalytics data={analyticsData.services} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <EarningsOverview data={analyticsData.earnings} />
        <RevenueBreakdown data={analyticsData.services.serviceBreakdown} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Detailed Service Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={analyticsData.services.serviceBreakdown} />
        </CardContent>
      </Card>
    </div>
  );
}
