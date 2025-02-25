"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const timeRanges = {
  "7days": {
    products: [
      {
        name: "Wireless Earbuds Pro",
        sales: 145,
        revenue: 14500,
        views: 2300,
        conversion: 6.3,
      },
      {
        name: "Smart Watch Elite",
        sales: 89,
        revenue: 17800,
        views: 1500,
        conversion: 5.9,
      },
      {
        name: "Bluetooth Speaker",
        sales: 65,
        revenue: 8450,
        views: 1200,
        conversion: 5.4,
      },
      {
        name: "Phone Case",
        sales: 55,
        revenue: 1100,
        views: 1100,
        conversion: 5.0,
      },
    ],
  },
  "30days": {
    products: [
      {
        name: "Wireless Earbuds Pro",
        sales: 645,
        revenue: 64500,
        views: 10300,
        conversion: 6.3,
      },
      {
        name: "Smart Watch Elite",
        sales: 389,
        revenue: 77800,
        views: 6500,
        conversion: 5.9,
      },
      {
        name: "Bluetooth Speaker",
        sales: 265,
        revenue: 34450,
        views: 5200,
        conversion: 5.4,
      },
      {
        name: "Phone Case",
        sales: 155,
        revenue: 3100,
        views: 4100,
        conversion: 5.0,
      },
    ],
  },
};

export function ProductPerformance() {
  const [timeRange, setTimeRange] = useState<"7days" | "30days">("7days");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Performance</CardTitle>
        <Select
          value={timeRange}
          onValueChange={(value: "7days" | "30days") => setTimeRange(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Sales</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Conv. Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeRanges[timeRange].products.map((product) => (
              <TableRow key={product.name}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.sales}</TableCell>
                <TableCell className="text-right">
                  ${product.revenue.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {product.views.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {product.conversion}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
