"use client";

import { Package, Truck, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const overviewCards = [
  {
    title: "Pending Shipments",
    value: "45",
    description: "Awaiting processing",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "In Transit",
    value: "28",
    description: "Currently shipping",
    icon: Truck,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Delayed",
    value: "3",
    description: "Behind schedule",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Issues",
    value: "2",
    description: "Require attention",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
];

export function ShippingOverview() {
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
