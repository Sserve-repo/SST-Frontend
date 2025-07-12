"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Search,
  Truck,
  Filter,
} from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { MdReplay } from "react-icons/md";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { formatCurrency } from "@/lib/order-utils";
import { BookingDetails } from "./booking-details";
import { OrderDetail } from "@/types/order";
import { baseUrl } from "@/config/constant";

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

type OrderDataType = {
  orders: OrderType[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

type FilterParams = {
  date_filter?: string;
  start_date?: string;
  end_date?: string;
  order_status?: string;
  search?: string;
  page?: number;
};

const statusStyles = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-purple-50 text-purple-700",
  processing: "bg-purple-50 text-purple-700",
  inprogress: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-700",
  "In Transit": "bg-blue-50 text-blue-700",
};

const paymentStatusStyles = {
  success: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
};

export default function BookingsPage() {
  const [orderData, setOrderData] = useState<OrderDataType | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<OrderDetail | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
  });
  const [customDateRange, setCustomDateRange] = useState({
    start_date: "",
    end_date: "",
  });
  const [showCustomDate, setShowCustomDate] = useState(false);

  const handleFetchBookings = async (params: FilterParams = {}) => {
    setLoading(true);
    try {
      // Merge current filters with new params
      const finalParams = { ...filters, ...params };

      // Build query string
      const queryParams = new URLSearchParams();

      if (finalParams.date_filter) {
        queryParams.append("date_filter", finalParams.date_filter);
      }
      if (finalParams.start_date) {
        queryParams.append("start_date", finalParams.start_date);
      }
      if (finalParams.end_date) {
        queryParams.append("end_date", finalParams.end_date);
      }
      if (finalParams.order_status) {
        queryParams.append("order_status", finalParams.order_status);
      }
      if (finalParams.search) {
        queryParams.append("search", finalParams.search);
      }
      if (finalParams.page) {
        queryParams.append("page", finalParams.page.toString());
      }

      const url = `${baseUrl}/shopper/dashboard/orders/services/list${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data.orders > 0) {
          console.log("")
          // Transform the data to match your existing structure
          const transformedOrders = data.data.orders.map((order: any) => ({
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

          setOrderData({
            orders: transformedOrders,
            current_page: data.data.current_page,
            per_page: data.data.per_page,
            total: data.data.total,
            last_page: data.data.last_page,
          });
        } else {
          setOrderData({
            orders: [],
            current_page: 1,
            per_page: 20,
            total: 0,
            last_page: 1,
          });
        }
      } else {
        setOrderData({
          orders: [],
          current_page: 1,
          per_page: 20,
          total: 0,
          last_page: 1,
        });
        console.error("Failed to fetch bookings:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBookingDetail = async (id: number) => {
    const response = await fetch(
      `${baseUrl}/shopper/dashboard/orders/services/itemsDetails/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
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
    }
  };

  const handleDateFilterChange = (value: string) => {
    const newFilters = { ...filters, date_filter: value, page: 1 };

    if (value === "custom") {
      setShowCustomDate(true);
      setCustomDateRange({ start_date: "", end_date: "" });
      setFilters(newFilters);
    } else {
      setShowCustomDate(false);
      setCustomDateRange({ start_date: "", end_date: "" });
      delete newFilters.start_date;
      delete newFilters.end_date;
      setFilters(newFilters);
      handleFetchBookings(newFilters);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    const newFilters = { ...filters, order_status: value, page: 1 };
    setFilters(newFilters);
    handleFetchBookings(newFilters);
  };

  const handleSearch = () => {
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    handleFetchBookings(newFilters);
  };

  const handleCustomDateApply = () => {
    if (customDateRange.start_date && customDateRange.end_date) {
      const newFilters = {
        ...filters,
        start_date: customDateRange.start_date,
        end_date: customDateRange.end_date,
        page: 1,
      };
      delete newFilters.date_filter;
      setFilters(newFilters);
      handleFetchBookings(newFilters);
      setShowCustomDate(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({ page: 1 });
    setSearchTerm("");
    setCustomDateRange({ start_date: "", end_date: "" });
    setShowCustomDate(false);
    handleFetchBookings({ page: 1 });
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    handleFetchBookings(newFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const generatePageNumbers = () => {
    if (!orderData) return [];

    const { current_page, last_page } = orderData;
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(last_page, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    handleFetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Service Orders
        </h2>

        {/* Search Bar */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by order ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 rounded-2xl"
            />
          </div>
          <Button onClick={handleSearch} className="rounded-2xl">
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4 p-3 bg-white rounded-3xl border-2 border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">Filter By</span>
          </div>

          <div className="flex flex-wrap gap-4 w-full sm:flex-1">
            <Select
              value={filters.date_filter || ""}
              onValueChange={handleDateFilterChange}
            >
              <SelectTrigger className="w-full sm:w-[180px] rounded-2xl">
                <SelectValue placeholder="Date Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="last_week">Last Week</SelectItem>
                <SelectItem value="30_days">Last 30 Days</SelectItem>
                <SelectItem value="60_days">Last 60 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.order_status || ""}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full sm:w-[180px] rounded-2xl">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleResetFilters}
            className="w-full sm:w-auto flex rounded-xl items-center gap-1"
          >
            <MdReplay size={20} />
            Reset Filters
          </Button>
        </div>

        {/* Custom Date Range */}
        {showCustomDate && (
          <div className="mb-6 flex flex-wrap items-center gap-2 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={customDateRange.start_date}
                onChange={(e) =>
                  setCustomDateRange({
                    ...customDateRange,
                    start_date: e.target.value,
                  })
                }
                className="w-auto rounded-lg border-blue-200 focus:border-blue-400"
                placeholder="Start Date"
              />
              <span className="text-sm text-gray-500">to</span>
              <Input
                type="date"
                value={customDateRange.end_date}
                onChange={(e) =>
                  setCustomDateRange({
                    ...customDateRange,
                    end_date: e.target.value,
                  })
                }
                className="w-auto rounded-lg border-blue-200 focus:border-blue-400"
                placeholder="End Date"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCustomDateApply}
                size="sm"
                className="rounded-lg"
                disabled={
                  !customDateRange.start_date || !customDateRange.end_date
                }
              >
                Apply
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCustomDate(false);
                  setCustomDateRange({ start_date: "", end_date: "" });
                  const newFilters = { ...filters };
                  delete newFilters.date_filter;
                  delete newFilters.start_date;
                  delete newFilters.end_date;
                  setFilters(newFilters);
                }}
                className="rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

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
                <TableHead>Booked Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                      <span className="ml-2">Loading orders...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : orderData && orderData?.orders?.length > 0 ? (
                orderData.orders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleFetchBookingDetail(order.id)}
                  >
                    <TableCell className="font-medium">
                      {(orderData.current_page - 1) * orderData.per_page +
                        index +
                        1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.order.orderNo}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.artisan.firstName} {order.artisan.lastName}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.serviceDetail?.title}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.order.total as any)}
                    </TableCell>
                    <TableCell>{formatDate(order.bookedDate)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 text-xs font-medium ${
                          paymentStatusStyles[
                            order.status as keyof typeof paymentStatusStyles
                          ]
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 text-xs font-medium ${
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
                      <div className="flex gap-x-2 items-center">
                        View Details
                        <FaArrowRight />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-gray-500">
                      {filters.search ||
                      filters.date_filter ||
                      filters.order_status
                        ? "No orders found matching your criteria"
                        : "No orders found"}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {orderData && orderData?.orders?.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4">
              <p className="text-sm text-gray-500">
                Showing {(orderData.current_page - 1) * orderData.per_page + 1}{" "}
                to{" "}
                {Math.min(
                  orderData.current_page * orderData.per_page,
                  orderData.total
                )}{" "}
                of {orderData.total} orders
              </p>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(orderData.current_page - 1)}
                  disabled={orderData.current_page === 1 || loading}
                >
                  Previous
                </Button>

                {generatePageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={
                      page === orderData.current_page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(orderData.current_page + 1)}
                  disabled={
                    orderData.current_page === orderData.last_page || loading
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
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
                    "Your service has been completed. Thank you for choosing us!",
                  date: formatDate(selectedBooking.updatedAt),
                  icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
                },
                {
                  message: "Your service is in progress.",
                  date: formatDate(selectedBooking.createdAt),
                  icon: <Truck className="h-5 w-5 text-purple-500" />,
                },
                {
                  message: "Your booking has been confirmed.",
                  date: formatDate(selectedBooking.createdAt),
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
