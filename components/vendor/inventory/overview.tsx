"use client";

import { Archive, Package, ShoppingBag, Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

const overviewCards = [
  {
    title: "Total Products",
    value: "2,345",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Published",
    value: "1,890",
    icon: ShoppingBag,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Drafts",
    value: "455",
    icon: Archive,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Categories",
    value: "45",
    icon: Tags,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

export function InventoryOverview() {
  const handleInventoryAnalytics = async () => {}
  ;

  useEffect(() => {
    handleInventoryAnalytics();
  }, []);
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
