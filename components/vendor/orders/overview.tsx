"use client";

import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrdersOverview({ overview }) {
  console.log({ overview });

  const overviewCards = [
    {
      title: "Active Listing",
      value: overview?.activeListings,
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed Orders",
      value: overview?.completeOrder,
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Sales",
      value: `${overview?.totalSales}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Order In Transit",
      value: overview.orderInTransit,
      icon: Package,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Pending Order",
      value: overview?.pendingOrder,
      icon: Package,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overviewCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`rounded-full p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
