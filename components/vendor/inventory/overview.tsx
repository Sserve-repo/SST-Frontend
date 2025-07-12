"use client";

import { Package, TrendingUp, AlertTriangle, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InventoryOverviewProps {
  overview: any;
}

export function InventoryOverview({ overview }: InventoryOverviewProps) {
  const stats = [
    {
      title: "Total Products",
      value: overview?.TotalProducts || 0,
      icon: Package,
      description: "Products in inventory",
      trend: "+12% from last month",
    },
    {
      title: "Total Categories",
      value: `${Number(overview?.TotalCategory || 0).toLocaleString()}`,
      icon: List,
      description: "Inventory categories",
      trend: "+8% from last month",
    },
    {
      title: "Pending Products",
      value: overview?.PendingProducts || 0,
      icon: AlertTriangle,
      description: "Products awaiting approval",
      trend: "Needs attention",
      variant: "warning" as const,
    },
    {
      title: "Published Products",
      value: overview?.ActiveProducts || 0,
      icon: TrendingUp,
      description: "Live products",
      trend: "+5% from last month",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            {/* <p
              className={`text-xs mt-1 ${
                stat.variant === "warning"
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            >
              {stat.trend}
            </p> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
