"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type React from "react"; // Added import for React

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: {
    value: string;
    trend: "up" | "down";
    timeframe: string;
  };
  iconClassName?: string;
}

function MetricCard({
  title,
  value,
  icon,
  change,
  iconClassName,
}: MetricCardProps) {
  return (
    <Card className="p-6 space-y-4 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl", iconClassName)}>{icon}</div>
        <div className="space-y-0.5">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
        </div>
      </div>
      <div className="flex items-center text-sm">
        {change.trend === "up" ? (
          <ArrowUpIcon className="w-4 h-4 text-emerald-500 mr-1" />
        ) : (
          <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span
          className={cn(
            "font-medium",
            change.trend === "up" ? "text-emerald-500" : "text-red-500"
          )}
        >
          {change.value}
        </span>
        <span className="text-muted-foreground ml-1">{change.timeframe}</span>
      </div>
    </Card>
  );
}

export function MetricCards() {
  const metrics = [
    {
      title: "Total Sales Increase",
      value: "$1,900,245",
      icon: <div className="w-8 h-8 bg-purple-100 rounded-full" />,
      iconClassName: "bg-purple-50",
      change: {
        value: "4.3%",
        trend: "down" as const,
        timeframe: "from yesterday",
      },
    },
    {
      title: "Total Product Delivered",
      value: "10293",
      icon: <div className="w-8 h-8 bg-orange-100 rounded-full" />,
      iconClassName: "bg-orange-50",
      change: {
        value: "1.3%",
        trend: "up" as const,
        timeframe: "from past week",
      },
    },
    {
      title: "Order In-Transit",
      value: "689",
      icon: <div className="w-8 h-8 bg-blue-100 rounded-full" />,
      iconClassName: "bg-blue-50",
      change: {
        value: "8.5%",
        trend: "up" as const,
        timeframe: "from yesterday",
      },
    },
    {
      title: "Cancelled Orders",
      value: "40",
      icon: <div className="w-8 h-8 bg-red-100 rounded-full" />,
      iconClassName: "bg-red-50",
      change: {
        value: "1.8%",
        trend: "up" as const,
        timeframe: "since last month",
      },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
