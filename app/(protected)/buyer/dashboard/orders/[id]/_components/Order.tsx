"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardCheck, ShieldCheck, Truck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDetails } from "./order-details";
import { useParams } from "next/navigation";
import { getOrderDetail } from "@/actions/dashboard/buyer";
import { convertTime } from "@/lib/utils";
import { FaArrowRight } from "react-icons/fa6";

type OrderItemsType = {
  id: string;
  orderId: string;
  userId: string;
  localId: string;
  vendorId: string;
  productListingDetailId: string;
  quantity: string;
  currency: string;
  unitPrice: string;
  totalAmount: string;
  bookingStatus?: string;
  orderStatus: string;
  orderType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  productName: string;
  vendorName: string;
};

interface OrderType {
  id: string;
  orderNo: string;
  userId: string;
  total: string;
  vendorTax: string;
  shippingCost: string;
  cartTotal: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderType: string;
  productItems: OrderItemsType[];
}

export default function Order() {
  const [selectedOrder, setSelectedOrder] = useState<OrderItemsType | null>(null);
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  const statusStyles = {
    pending: "bg-yellow-50 text-yellow-700",
    processing: "bg-blue-50 text-blue-700",
    intransit: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getOrderDetail(params.id as string);
        
        if (response.data && !response.error) {
          setOrder(response.data);
        } else {
          setError(response.error || "Failed to fetch order details");
        }
      } catch (err) {
        console.error("Error fetching order detail:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">📦</div>
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight py-4">
          Orders History For Order No: {order?.orderNo}
        </h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center py-4">
          <div className="relative flex flex-1 gap-x-2">
            <p className="">
              {order && convertTime(order.productItems[0]?.createdAt)}
            </p>
            <p className="bg-green-100 text-green-600 rounded-2xl px-2">
              {order &&
                order?.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PRODUCTS</TableHead>
                <TableHead>VENDOR NAME</TableHead>
                <TableHead>TOTAL AMOUNT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order &&
                order.productItems.map((orderItem: OrderItemsType, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex space-x-3">
                        <div className="text-start">
                          <p className="font-medium text-gray-900">
                            {orderItem.productName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {orderItem.quantity}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{orderItem.vendorName}</TableCell>
                    <TableCell>
                      {orderItem.currency} {orderItem.totalAmount}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusStyles[
                            orderItem.orderStatus as keyof typeof statusStyles
                          ] || "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {orderItem.orderStatus
                          ? orderItem.orderStatus.charAt(0).toUpperCase() +
                            orderItem.orderStatus.slice(1)
                          : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex justify-center items-center space-x-2 text-orange-400 cursor-pointer"
                        onClick={() =>
                          setSelectedOrder(order["productItems"][index])
                        }
                      >
                        <p>View Details</p>
                        <FaArrowRight />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Order Details Sheet */}
        {selectedOrder && (
          <OrderDetails
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            order={{
              ...selectedOrder,
              shipping_cost: order?.shippingCost || "0.00",
              vendor_tax: order?.vendorTax || "0.00",
              cart_total: order?.cartTotal || "0.00",
              total: order?.total || "0.00",
              order_type: order?.orderType,
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
            }}
          />
        )}
      </div>
    </div>
  );
}
