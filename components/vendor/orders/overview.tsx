"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Truck, CheckCircle } from "lucide-react";

interface OrdersOverviewProps {
  overview: any;
}

export function OrdersOverview({ overview }: OrdersOverviewProps) {
  const stats = [
    {
      title: "Total Orders",
      value: overview?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Sales",
      value: `$${Number(overview?.totalSales || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Completed Orders",
      value: overview?.completeOrder || 0,
      icon: CheckCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Orders In Transit",
      value: overview?.orderInTransit || 0,
      icon: Truck,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">
              {index === 0 && "Total number of orders"}
              {index === 1 && "Revenue generated"}
              {index === 2 && "Successfully delivered"}
              {index === 3 && "Currently shipping"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
