"use client";

import { Archive, Package, ShoppingBag, Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const overviewCards = [
  {
    title: "Total Products",
    value: "2,345",
    description: "+180 from last month",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Published",
    value: "1,890",
    description: "Active listings",
    icon: ShoppingBag,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Drafts",
    value: "455",
    description: "Pending review",
    icon: Archive,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Categories",
    value: "45",
    description: "Across 6 departments",
    icon: Tags,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

export function InventoryOverview() {
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
