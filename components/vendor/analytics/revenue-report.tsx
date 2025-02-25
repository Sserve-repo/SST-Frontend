"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reports = {
  daily: [
    {
      date: "2024-02-24",
      orders: 45,
      revenue: 4500,
      refunds: 2,
      refundAmount: 200,
    },
    {
      date: "2024-02-23",
      orders: 38,
      revenue: 3800,
      refunds: 1,
      refundAmount: 100,
    },
    {
      date: "2024-02-22",
      orders: 52,
      revenue: 5200,
      refunds: 3,
      refundAmount: 300,
    },
  ],
  weekly: [
    {
      date: "Week 8, 2024",
      orders: 245,
      revenue: 24500,
      refunds: 12,
      refundAmount: 1200,
    },
    {
      date: "Week 7, 2024",
      orders: 238,
      revenue: 23800,
      refunds: 8,
      refundAmount: 800,
    },
    {
      date: "Week 6, 2024",
      orders: 252,
      revenue: 25200,
      refunds: 15,
      refundAmount: 1500,
    },
  ],
  monthly: [
    {
      date: "February 2024",
      orders: 945,
      revenue: 94500,
      refunds: 42,
      refundAmount: 4200,
    },
    {
      date: "January 2024",
      orders: 838,
      revenue: 83800,
      refunds: 38,
      refundAmount: 3800,
    },
    {
      date: "December 2023",
      orders: 1052,
      revenue: 105200,
      refunds: 55,
      refundAmount: 5500,
    },
  ],
};

type TimeRange = "daily" | "weekly" | "monthly";

export function RevenueReport() {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const exportReport = () => {
    // Implementation for CSV export
    console.log("Exporting revenue report...");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue Report</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={(value: TimeRange) => setTimeRange(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={exportReport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Refunds</TableHead>
              <TableHead className="text-right">Refund Amount</TableHead>
              <TableHead className="text-right">Net Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports[timeRange].map((report) => (
              <TableRow key={report.date}>
                <TableCell>{report.date}</TableCell>
                <TableCell className="text-right">{report.orders}</TableCell>
                <TableCell className="text-right">
                  ${report.revenue.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{report.refunds}</TableCell>
                <TableCell className="text-right">
                  ${report.refundAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ${(report.revenue - report.refundAmount).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
