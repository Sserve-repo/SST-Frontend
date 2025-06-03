"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getBookings,
  cancelBooking,
  approveBooking,
  completeBooking,
  type Booking,
} from "@/actions/admin/booking-api";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { BookingFilters } from "@/components/admin/bookings/booking-filters";

interface BookingTableItem {
  id: string;
  orderNo: string;
  customer: string;
  service: string;
  artisan: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  price: string;
}

interface BookingStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
  totalRevenue: string;
}

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<BookingTableItem[]>([]);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    cancelled: 0,
    totalRevenue: "0",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get filters from URL params
  const filters = {
    status: searchParams.get("status") || "",
    booking_status: searchParams.get("booking_status") || "",
    search: searchParams.get("search") || "",
  };

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await getBookings({
        status: filters.status || undefined,
        booking_status: filters.booking_status || undefined,
        search: filters.search || undefined,
      });

      if (apiError) {
        throw new Error(apiError);
      }

      if (data) {
        setStats({
          total: data.total,
          completed: data.completedService,
          pending: data.pendingService,
          inProgress: data.serviceInProgress,
          cancelled: data.cancelledService,
          totalRevenue: data.TotalExpenditure,
        });

        const formattedBookings = data.orders.map((booking: Booking) => ({
          id: booking.id.toString(),
          orderNo: booking.order.order_no,
          customer: `${booking.customer.firstname} ${booking.customer.lastname}`,
          service: booking.service_detail.title,
          artisan: `${booking.artisan.firstname} ${booking.artisan.lastname}`,
          bookingDate: new Date(booking.booked_date).toLocaleDateString(),
          bookingTime: `${booking.booked_time} - ${booking.booked_time_to}`,
          status: booking.booking_status,
          price: `$${booking.price}`,
        }));
        setBookings(formattedBookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.booking_status, filters.search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleBookingAction = async (
    id: string,
    action: "approve" | "complete" | "cancel"
  ) => {
    setIsUpdating(true);
    try {
      let result;
      switch (action) {
        case "approve":
          result = await approveBooking(id);
          break;
        case "complete":
          result = await completeBooking(id);
          break;
        case "cancel":
          result = await cancelBooking(id);
          break;
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: `Booking ${action}d successfully.`,
      });

      fetchBookings();
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} booking. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`?${params.toString()}`);
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "inprogress":
        return "outline";
      default:
        return "outline";
    }
  };

  const columns: ColumnDef<BookingTableItem>[] = [
    { accessorKey: "orderNo", header: "Order No" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "service", header: "Service" },
    { accessorKey: "artisan", header: "Artisan" },
    { accessorKey: "bookingDate", header: "Date" },
    { accessorKey: "bookingTime", header: "Time" },
    { accessorKey: "price", header: "Price" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.getValue("status"))}>
          {(row.getValue("status") as string).replace("_", " ")}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={isUpdating}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/dashboard/bookings/${booking.id}`)
                }
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {booking.status === "pending" && (
                <DropdownMenuItem
                  onClick={() => handleBookingAction(booking.id, "approve")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Approve
                </DropdownMenuItem>
              )}
              {booking.status === "inprogress" && (
                <DropdownMenuItem
                  onClick={() => handleBookingAction(booking.id, "complete")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark Complete
                </DropdownMenuItem>
              )}
              {booking.status !== "cancelled" &&
                booking.status !== "completed" && (
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleBookingAction(booking.id, "cancel")}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchBookings} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            Service Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage customer service bookings and appointments
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">Finished services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">Active services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelled}
            </div>
            <p className="text-xs text-muted-foreground">Cancelled bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalRevenue}
            </div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
      </div>

      {showFilters && (
        <BookingFilters filters={filters} onFiltersChange={updateFilters} />
      )}

      <DataTable
        columns={columns}
        data={bookings}
        searchKey="customer"
        searchPlaceholder="Search by customer..."
      />
    </div>
  );
}
