"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
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
import {
  getBookingDetail,
  getBookinglist,
} from "@/actions/dashboard/buyer";
import { convertTime } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/order-utils";
import { BookingDetails } from "./booking-details";
import { OrderDetail } from "@/types/order";

type OrderType = {
  id: number;
  orderNo: number;
  userId: number;
  artisanId: number;
  serviceListingDetailId: number;
  currency: string;
  price: number;
  bookedDate: string;
  bookedTime: string;
  bookedTimeTo: string;
  bookingStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  serviceDetail: {
    id: number;
    title: string;
    serviceCategoryId: number;
    serviceCategory: {
      id: number;
      name: string;
    };
  };
  artisan: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  order: {
    id: number;
    orderNo: string;
    total: string;
    vendorTax: string;
    cartTotal: string;
  };
};

type OrderTypes = OrderType[];

const statusStyles = {
  success: "bg-emerald-50 text-emerald-700",
  pending: "bg-purple-50 text-purple-700",
  processing: "bg-purple-50 text-purple-700",
  cancelled: "bg-red-50 text-red-700",
  "In Transit": "bg-blue-50 text-blue-700",
};

const paymentStatusStyles = {
  success: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
};

export default function BookingsPage() {
  const [orderData, setOrderData] = useState<OrderTypes | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<OrderDetail | null>(
    null
  );

  const handleFetchBookings = async () => {
    const response = await getBookinglist();
    const data = await response?.json();

    if (!response?.ok) {
    }

    const orders = data.data["orders"];
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      orderNo: order.order_id,
      userId: order.user_id,
      artisanId: order.artisan_id,
      serviceListingDetailId: order.service_listing_detail_id,
      currency: order.currency,
      price: order.price,
      bookedDate: order.booked_date,
      bookedTime: order.booked_time,
      bookedTimeTo: order.booked_time_to,
      bookingStatus: order.booking_status,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      serviceDetail: {
        id: order.service_detail.id,
        title: order.service_detail.title,
        serviceCategoryId: order.service_detail.service_category_id,
        serviceCategory: {
          id: order.service_detail.service_category.id,
          name: order.service_detail.service_category.name,
        },
      },
      artisan: {
        id: order.artisan.id,
        firstName: order.artisan.firstname,
        lastName: order.artisan.lastname,
        email: order.artisan.email,
      },
      order: {
        id: order.order.id,
        orderNo: order.order.order_no,
        total: order.order.total,
        vendorTax: order.order.vendor_tax,
        cartTotal: order.order.cart_total,
      },
    }));
    setOrderData(transformedOrders);
  };

  const handleFetchBookingDetail = async (id) => {
    const response = await getBookingDetail(id);
    const data = await response?.json();
    console.log({ data });

    if (!response?.ok) {
    }

    const order = data.data;
    const transformedBookings = {
      id: order.id,
      orderNo: order.order_no,
      userId: order.user_id,
      artisanId: order.artisan_id,
      serviceListingDetailId: order.service_listing_detail_id,
      currency: order.currency,
      price: order.price,
      bookedDate: order.booked_date,
      bookedTime: order.booked_time,
      bookedTimeTo: order.booked_time_to,
      bookingStatus: order.booking_status,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      serviceListingName: order.service_listing_name,
      serviceCategory: order.service_category,
      serviceSubcategory: order.service_subcategory,
      order: {
        id: order.order.id,
        title: order.order.title,
        serviceCategoryId: order.order.service_category_id,
        total: order.order.total,
        vendorTax: order.order.vendor_tax,
        shippingCost: order.order.shipping_cost,
        cartTotal: order.order.cart_total,
        orderType: order.order.order_type,
        status: order.order.status,
        createdAt: order.order.created_at,
        updatedAt: order.order.updated_at,
      },
    };
    setSelectedBooking(transformedBookings);
  };

  useEffect(() => {
    handleFetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Bookings
        </h2>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center py-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer name..."
              className="pl-8 sm:max-w-[300px]"
            />
          </div>
          <div className="flex gap-4">
            <Select defaultValue="all-status">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select defaultValue="all-payment">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-payment">
                    All Payment Status
                  </SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="refund_pending">Refund Pending</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-white overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Order No</TableHead>
                <TableHead>Artisan</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData &&
                orderData.map((order, index) => (
                  <TableRow
                    key={order?.orderNo}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleFetchBookingDetail(order.id)}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {order?.order.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order?.artisan.firstName} {order?.artisan.lastName}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order?.serviceDetail?.title}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order?.order.total as any)}
                    </TableCell>
                    <TableCell>{convertTime(order?.createdAt)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 text-[sm] font-medium ${
                          paymentStatusStyles[
                            order.status as keyof typeof paymentStatusStyles
                          ]
                        }`}
                      >
                        {order?.status.charAt(0).toUpperCase() +
                          order?.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 text-[sm] font-medium ${
                          statusStyles[
                            order.bookingStatus as keyof typeof statusStyles
                          ]
                        }`}
                      >
                        {order.bookingStatus.charAt(0).toUpperCase() +
                          order.bookingStatus.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-orange-400">
                      <div
                        className="flex gap-x-2"
                        onClick={() => handleFetchBookingDetail(order.id)}
                      >
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

        {/* Booking Details Sheet */}
        {selectedBooking && (
          <BookingDetails
            isOpen={!!selectedBooking}
            onClose={() => setSelectedBooking(null)}
            order={{
              ...selectedBooking,
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
