"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
// import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, Users, Star, DollarSign } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function SalesAnalytics({ analytics }: { analytics: any }) {
  const [activeChart, setActiveChart] = useState("overview");

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00af00",
    "#0088fe",
    "#ff8042",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
  ];

  const revenueData = useMemo(() => {
    return (analytics?.revenueStats || []).map((item: any) => ({
      month: monthNames[item.month - 1] || `Month ${item.month}`,
      revenue: parseFloat(item.total_revenue || 0),
    }));
  }, [analytics?.revenueStats]);

  const orderTrends = useMemo(() => {
    return (analytics?.orderTrends || []).map((item: any) => ({
      month: monthNames[item.month - 1] || `Month ${item.month}`,
      orders: parseInt(item.total_orders || 0),
    }));
  }, [analytics?.orderTrends]);

  const topProducts = useMemo(() => {
    const grouped: Record<string, number> = {};
    for (const item of analytics?.topProducts || []) {
      const name = item.product_name || "Unknown Product";
      const sales = parseInt(item.total_sold || 0);
      grouped[name] = (grouped[name] || 0) + sales;
    }
    return Object.entries(grouped)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0))
      .slice(0, 10);
  }, [analytics?.topProducts]);

  const monthlyProductSales = useMemo(() => {
    const grouped: Record<string, number> = {};
    for (const item of analytics?.topProducts || []) {
      const month = monthNames[item.month - 1] || `Month ${item.month}`;
      grouped[month] = (grouped[month] || 0) + parseInt(item.total_sold || 0);
    }
    return Object.entries(grouped).map(([month, sales]) => ({ month, sales }));
  }, [analytics?.topProducts]);

  const summaryStats = useMemo(() => {
    const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = orderTrends.reduce((sum, d) => sum + d.orders, 0);
    const totalProductsSold = topProducts.reduce(
      (sum, d) => sum + (d.sales || 0),
      0
    );
    return {
      totalRevenue,
      totalOrders,
      totalProductsSold,
      averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
      topProduct: topProducts[0]?.name || "N/A",
      topProductSales: topProducts[0]?.sales || 0,
    };
  }, [revenueData, orderTrends, topProducts]);

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
      <Package className="w-12 h-12 mb-2" />
      <p className="text-sm">{message}</p>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Sales Analytics
        </CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Stat
            icon={<DollarSign className="w-4 h-4 text-blue-600" />}
            label="Total Revenue"
            value={`$${summaryStats.totalRevenue.toFixed(2)}`}
            bg="blue"
          />
          <Stat
            icon={<Package className="w-4 h-4 text-green-600" />}
            label="Total Orders"
            value={summaryStats.totalOrders}
            bg="green"
          />
          <Stat
            icon={<Star className="w-4 h-4 text-purple-600" />}
            label="Products Sold"
            value={summaryStats.totalProductsSold}
            bg="purple"
          />
          <Stat
            icon={<Users className="w-4 h-4 text-orange-600" />}
            label="Avg Order Value"
            value={`$${summaryStats.averageOrderValue.toFixed(2)}`}
            bg="orange"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeChart} onValueChange={setActiveChart}>
          <TabsList className="mb-4 grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Order Trends</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            {revenueData.length ? (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No revenue data available" />
            )}
          </TabsContent>

          <TabsContent value="products">
            {topProducts.length ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx="50%"
                    cy="50%"
                    label={({ name }) => name}
                    outerRadius={100}
                    dataKey="sales"
                  >
                    {topProducts.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No product data available" />
            )}
          </TabsContent>

          <TabsContent value="orders">
            {orderTrends.length ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={orderTrends}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#82ca9d"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No order trends data available" />
            )}
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Product Distribution
                </h3>
                {topProducts.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={topProducts.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        dataKey="sales"
                      >
                        {topProducts.slice(0, 6).map((entry, index) => (
                          <Cell
                            key={`slice-${entry.name}-${index}`}
                            fill={colors[index % colors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="No product data available" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Monthly Sales Volume
                </h3>
                {monthlyProductSales.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyProductSales}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="sales" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="No monthly sales data available" />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Stat({
  icon,
  label,
  value,
  bg,
}: {
  icon: JSX.Element;
  label: string;
  value: string | number;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-2 p-3 bg-${bg}-50 rounded-lg`}>
      {icon}
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className={`font-semibold text-${bg}-600`}>{value}</p>
      </div>
    </div>
  );
}
