"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", pending: 80, completed: 520 },
  { month: "Feb", pending: 90, completed: 650 },
  { month: "Mar", pending: 20, completed: 90 },
  { month: "Apr", pending: 60, completed: 400 },
  { month: "May", pending: 30, completed: 200 },
  { month: "Jun", pending: 80, completed: 550 },
  { month: "Jul", pending: 50, completed: 670 },
  { month: "Sep", pending: 50, completed: 350 },
  { month: "Oct", pending: 80, completed: 570 },
  { month: "Nov", pending: 100, completed: 750 },
];

export function EarningsChart() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-medium">Earning Details</CardTitle>
          <p className="text-2xl font-bold text-primary">$10,900,245</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 text-sm">15% Since last month</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="month"
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
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="pending" fill="#FFA500" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="#502366" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span>Pending Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Completed Orders</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
