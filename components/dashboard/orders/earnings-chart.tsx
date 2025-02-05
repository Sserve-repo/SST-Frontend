"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ArrowUpRight } from "lucide-react";

interface EarningsChartProps {
  data: Array<{
    month: string;
    pending: number;
    completed: number;
  }>;
  total: string;
  trend: {
    value: number;
    text: string;
  };
}

export function EarningsChart({ data, total, trend }: EarningsChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <h3 className="text-base font-normal text-muted-foreground">
            Earning Details
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold tracking-tight text-purple-600">
              {total}
            </p>
            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4" />
              {trend.value}% {trend.text}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
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
              <Bar
                dataKey="pending"
                fill="#FFA500"
                radius={[4, 4, 0, 0]}
                name="Pending Orders"
              />
              <Bar
                dataKey="completed"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
                name="Completed Orders"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-sm text-muted-foreground">
                Pending Orders
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <span className="text-sm text-muted-foreground">
                Completed Orders
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
