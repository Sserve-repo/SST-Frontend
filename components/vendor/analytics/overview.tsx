"use client";

import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const overviewCards = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    description: "Compared to last month",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+12.5%",
    description: "Compared to last month",
    icon: ShoppingCart,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Unique Visitors",
    value: "45,678",
    change: "+32.1%",
    description: "Compared to last month",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    title: "Conversion Rate",
    value: "2.8%",
    change: "+1.2%",
    description: "Compared to last month",
    icon: TrendingUp,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
];

export function AnalyticsOverview() {
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
            <div className="mt-1 flex items-center text-sm">
              <span
                className={
                  card.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {card.change}
              </span>
              <span className="ml-2 text-muted-foreground">
                {card.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
