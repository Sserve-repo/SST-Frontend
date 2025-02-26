"use client";

import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const overviewCards = [
  {
    title: "Total Orders",
    value: "1,234",
    description: "+180 this month",
    icon: ShoppingCart,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Total Revenue",
    value: "$45,231",
    description: "+20.1% from last month",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Pending Shipments",
    value: "23",
    description: "12 awaiting processing",
    icon: Package,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Average Order Value",
    value: "$123",
    description: "+5% from last month",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

export function OrdersOverview() {
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
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
