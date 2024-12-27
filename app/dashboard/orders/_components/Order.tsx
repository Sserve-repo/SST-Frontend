"use client";

import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
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
import { MdReplay } from "react-icons/md";
import { getOrderlist } from "@/actions/dashboard";
import { useRouter } from "next/navigation";
import { convertTime } from "@/lib/utils";

type OrderType = {
  id: string;
  order_no: string;
  order_type: string;
  cart_total: string;
  created_at: string;
}[];

export default function OrdersPage() {
  const [orderData, setOrderData] = useState<OrderType | null>(null);
  const router = useRouter();
  const handleFetchOrders = async () => {
    const response = await getOrderlist();
    if (response && response.ok) {
      const data = await response.json();
      setOrderData(data.data["orders"]);
    }
  };

  useEffect(() => {
    handleFetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Orders Lists
        </h2>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4 p-3 bg-white rounded-3xl border-2 border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">Filter By</span>
          </div>

          <div className="flex flex-wrap gap-4 w-full sm:flex-1">
            <Select>
              <SelectTrigger className="w-full sm:w-[180px] rounded-2xl">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full sm:w-[180px] rounded-2xl">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="w-full sm:w-auto flex rounded-xl items-center gap-1"
          >
            <MdReplay size={20} />
            Reset Filter
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-white overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">ORDER ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>ORDER TYPE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData &&
                orderData.map((order) => (
                  <TableRow
                    key={order?.order_no}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      router.push(`/dashboard/orders/${order?.id}`)
                    }
                  >
                    <TableCell className="font-medium">
                      {order?.order_no}
                    </TableCell>
                    <TableCell>{convertTime(order?.created_at)}</TableCell>
                    <TableCell>{order?.order_type}</TableCell>
                    <TableCell>{order?.cart_total}</TableCell>
                    <TableCell className="text-orange-400">
                      <div className="flex gap-x-2">
                        View Details
                        <FaArrowRight />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4">
            <p className="text-sm text-gray-500">Showing 1-09 of 78</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
