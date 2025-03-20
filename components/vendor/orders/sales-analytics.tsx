"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 2780 },
  { month: "May", revenue: 1890 },
  { month: "Jun", revenue: 2390 },
];

const orderTrends = [
  { date: "Mon", orders: 15 },
  { date: "Tue", orders: 20 },
  { date: "Wed", orders: 25 },
  { date: "Thu", orders: 18 },
  { date: "Fri", orders: 30 },
  { date: "Sat", orders: 35 },
  { date: "Sun", orders: 28 },
];

export function SalesAnalytics({ analytics }) {
  console.log({ analytics });

  const [activeChart, setActiveChart] = useState("revenue");
  const [trends] = useState<any>({
    orderTrends: orderTrends,
    topProducts: analytics?.Analytics?.topProducts?.map((item) => {
      return {
        name: item?.product_name,
        sales: item?.total_sold,
      };
    }),
    revenueData: revenueData,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeChart} onValueChange={setActiveChart}>
          <TabsList className="mb-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="orders">Order Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends?.revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="products" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.topProducts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="orders" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends?.orderTrends}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
