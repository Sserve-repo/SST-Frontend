"use client";

import { useState } from "react";
import { Filter } from "lucide-react";

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
import { CheckCircle2, Truck, ShieldCheck, ClipboardCheck } from "lucide-react";
import { OrderDetails } from "./order-details";
import { MdReplay } from "react-icons/md";

interface Order {
  id: string;
  name: string;
  address: string;
  category: string;
  date: string;
  status: string;
  quantity: number;
  tax: number;
  shippingCost: number;
  price: number;
  activities: {
    message: string;
    date: string;
    icon: React.ReactNode;
  }[];
}

const orders: Order[] = [
  {
    id: "#96459761",
    name: "Christine Brooks",
    address: "089 Hutch Green Apt. 448",
    category: "Electric",
    date: "17 Jan 2021",
    status: "Delivered",
    quantity: 1,
    tax: 5.0,
    shippingCost: 15.0,
    price: 50.0,
    activities: [
      {
        message:
          "Your order has been delivered. Thank you for shopping at Clicon!",
        date: "23 Jan, 2021 at 7:32 PM",
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      },
      {
        message: "Your order is in Transit.",
        date: "22 Jan, 2021 at 8:00 AM",
        icon: <Truck className="h-5 w-5 text-purple-500" />,
      },
      {
        message: "Your order is successfully Verified.",
        date: "20 Jan, 2021 at 7:32 PM",
        icon: <ShieldCheck className="h-5 w-5 text-orange-500" />,
      },
      {
        message: "Your order has been Confirmed.",
        date: "19 Jan, 2021 at 2:61 PM",
        icon: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
      },
    ],
  },
  // ... other orders with similar structure
];

const statusStyles = {
  Delivered: "bg-emerald-50 text-emerald-700",
  Processing: "bg-purple-50 text-purple-700",
  Cancelled: "bg-red-50 text-red-700",
  "In Transit": "bg-blue-50 text-blue-700",
};

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Orders History
        </h2>
        {/* Header with Order ID and Price */}
        <div className="my-8 rounded-2xl bg-purple-50 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-medium text-gray-600">
                Order ID No.: {orders[0].id}
              </h2>
              <p className="text-sm text-gray-500">
                4 Products • Order Placed in 17 Jan 2021 at 7:32 PM
              </p>
            </div>
            <div className="text-2xl font-semibold text-primary">
              $1199.00
            </div>
          </div>
        </div>

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
                <TableHead className="w-[200px]">NAME</TableHead>
                <TableHead>ADDRESS</TableHead>
                <TableHead>CATEGORY</TableHead>
                <TableHead>ACTION</TableHead>
                <TableHead>STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className="font-medium">{order.name}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.category}</TableCell>
                  <TableCell>
                    <Select>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Complete" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="cancel">Cancel</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        statusStyles[order.status as keyof typeof statusStyles]
                      }`}
                    >
                      {order.status}
                    </span>
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

        {/* Order Details Sheet */}
        {selectedOrder && (
          <OrderDetails
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            order={selectedOrder}
          />
        )}
      </div>
    </div>
  );
}
