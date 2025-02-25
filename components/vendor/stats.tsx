"use client";

import {
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  Truck,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const stats = [
  {
    title: "Total Sales",
    value: "$45,231",
    change: "+20.1%",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50",
    description: "Compared to last month",
  },
  {
    title: "Active Listings",
    value: "356",
    change: "-3.2%",
    trend: "down",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    description: "Total active products",
  },
  {
    title: "Revenue",
    value: "$12,234",
    change: "+8.4%",
    trend: "up",
    icon: DollarSign,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    description: "Current month earnings",
  },
  {
    title: "Pending Orders",
    value: "23",
    change: "+12",
    trend: "up",
    icon: ShoppingCart,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    description: "Awaiting processing",
  },
  {
    title: "Pending Shipments",
    value: "12",
    change: "-5",
    trend: "down",
    icon: Truck,
    color: "text-red-500",
    bgColor: "bg-red-50",
    description: "Ready to ship",
  },
];

export function DashboardStats() {

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <TooltipProvider key={stat.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`rounded-full p-2 ${stat.bgColor}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs">
                      <span
                        className={`flex items-center ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        {stat.change}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        {stat.description}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
