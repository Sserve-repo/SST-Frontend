"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = {
  daily: [
    { date: "Mon", sales: 145 },
    { date: "Tue", sales: 231 },
    { date: "Wed", sales: 382 },
    { date: "Thu", sales: 289 },
    { date: "Fri", sales: 470 },
    { date: "Sat", sales: 534 },
    { date: "Sun", sales: 290 },
  ],
  weekly: [
    { date: "Week 1", sales: 2145 },
    { date: "Week 2", sales: 1831 },
    { date: "Week 3", sales: 2982 },
    { date: "Week 4", sales: 2789 },
  ],
  monthly: [
    { date: "Jan", sales: 8145 },
    { date: "Feb", sales: 7231 },
    { date: "Mar", sales: 9382 },
    { date: "Apr", sales: 8289 },
    { date: "May", sales: 7470 },
    { date: "Jun", sales: 8534 },
  ],
};

type TimeRange = "daily" | "weekly" | "monthly";

export function SalesChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle>Sales Overview</CardTitle>
        <div className="space-x-2">
          <Button
            variant={timeRange === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("daily")}
          >
            Daily
          </Button>
          <Button
            variant={timeRange === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("weekly")}
          >
            Weekly
          </Button>
          <Button
            variant={timeRange === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("monthly")}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data[timeRange]}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
