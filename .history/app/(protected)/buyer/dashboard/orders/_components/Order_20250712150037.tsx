"use client";

import { useEffect, useState } from "react";
import { Filter, Search } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
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
import { MdReplay } from "react-icons/md";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/config/constant";

type ProductOrderType = {
  id: number;
  order_no: string;
  order_type: string;
  cart_total: string;
  created_at: string;
  // Add other fields that might be in the full response
  status?: string;
  total?: string;
  vendor_tax?: string;
  user_id?: number;
  updated_at?: string;
};

type OrderDataType = {
  orders: ProductOrderType[];
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

export default function ProductOrdersPage() {
  const [orderData, setOrderData] = useState<OrderDataType | null>(null);
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
  const router = useRouter();

  const handleFetchOrders = async (
    params: FilterParams = {},
    isReset = false
  ) => {
    setLoading(true);
    try {
      // Merge current filters with new params
      const finalParams = isReset ? params : { ...filters, ...params };

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

      const url = `${baseUrl}/shopper/dashboard/orders/products/list${
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
        setOrderData(data.data);
      } else {
        setOrderData([] as any);
        console.error("Failed to fetch orders:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Also update the handleDateFilterChange function to be more explicit:
  const handleDateFilterChange = (value: string) => {
    console.log("Date filter changed to:", value); // Debug log

    if (value === "custom") {
      setShowCustomDate(true);
      setCustomDateRange({ start_date: "", end_date: "" });
      // Update filters but don't fetch yet
      setFilters({ ...filters, date_filter: value, page: 1 });
    } else {
      setShowCustomDate(false);
      setCustomDateRange({ start_date: "", end_date: "" });
      // Clear custom date fields and apply new filter
      const newFilters = { ...filters, date_filter: value, page: 1 };
      delete newFilters.start_date;
      delete newFilters.end_date;
      setFilters(newFilters);
      handleFetchOrders(newFilters);
    }
  };

  // Update handleCustomDateApply with better logging:
  const handleCustomDateApply = () => {
    console.log("Applying custom date range:", customDateRange);

    if (customDateRange.start_date && customDateRange.end_date) {
      const newFilters = {
        ...filters,
        start_date: customDateRange.start_date,
        end_date: customDateRange.end_date,
        page: 1,
      };
      // Remove date_filter when using custom dates
      delete newFilters.date_filter;

      console.log("New filters:", newFilters);

      setFilters(newFilters);
      handleFetchOrders(newFilters);
      setShowCustomDate(false);
    } else {
      console.log("Missing dates:", customDateRange);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    const newFilters = { ...filters, order_status: value, page: 1 };
    setFilters(newFilters);
    handleFetchOrders(newFilters);
  };

  const handleSearch = () => {
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    handleFetchOrders(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = { page: 1 };
    setFilters(resetFilters);
    setSearchTerm("");
    setCustomDateRange({ start_date: "", end_date: "" });
    setShowCustomDate(false);
    handleFetchOrders(resetFilters, true);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    handleFetchOrders(newFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    handleFetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "processing":
        return "text-blue-600 bg-blue-50";
      case "shipped":
        return "text-purple-600 bg-purple-50";
      case "delivered":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Product Orders
        </h2>

        {/* Search Bar */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by order ID or order number..."
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
                <SelectItem value="delivered">Delivered</SelectItem>
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
                <TableHead className="w-[150px]">ORDER NO</TableHead>
                <TableHead>ORDER TYPE</TableHead>
                <TableHead>DATE ORDERED</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
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
                    onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                  >
                    <TableCell className="font-medium">
                      {(orderData.current_page - 1) * orderData.per_page +
                        index +
                        1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.order_no}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize font-medium">
                        {order.order_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatDate(order.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.status ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.cart_total}
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
                  <TableCell colSpan={7} className="text-center py-8">
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
      </div>
    </div>
  );
}
