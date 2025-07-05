"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  CalendarIcon,
  List,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  PlayCircle,
  Clock2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounced-search";
import { AppointmentSkeletonList } from "./appointment-skeleton-list";
import { CalendarView } from "./calender-view";
import { AppointmentFilters } from "./filters";
import { RescheduleDialog } from "./reschedule-dialog";
import { AppointmentDetailsDialog } from "./details-dialog";
import {
  getAppointmentsPaginated,
  bookingCompleteHandler,
  bookingInprogressHandler,
  cancelBookingHandler,
} from "@/actions/dashboard/artisans";
import type { Appointment, AppointmentStatus } from "@/types/appointments";

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface AppointmentsResponse {
  status: boolean;
  data: {
    orders: any[];
    pagination?: PaginationData;
  };
  message?: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["all"]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [rescheduleAppointment, setRescheduleAppointment] =
    useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] =
    useState<Appointment | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const currentView = searchParams.get("view") || "list";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  // Transform appointment data helper
  const transformAppointment = useCallback((orders: any): Appointment => {
    const service = {
      id: String(orders.service_listing_detail_id || orders.service_id || ""),
      name:
        orders.service_detail?.title ||
        orders.service?.name ||
        "Unknown Service",
      price: Number(orders.price) || 0,
      duration: Number(
        orders.service_detail?.service_duration || orders.duration || 60
      ),
    };

    const order = {
      id: String(orders.order_id || ""),
      orderNo: String(orders.order_no || orders.order_id || ""),
      total: String(orders.total || orders.price || "0"),
      vendorTax: String(orders.vendor_tax || "0"),
      cartTotal: String(orders.cart_total || orders.total || "0"),
    };

    return {
      id: String(orders.id),
      customerName:
        `${orders.customer?.firstname || ""} ${
          orders.customer?.lastname || ""
        }`.trim() ||
        orders.user?.name ||
        "Unknown Customer",
      customerEmail: orders.customer?.email || orders.user?.email || "",
      customerPhone: orders.customer?.phone || orders.user?.phone || "",
      service,
      serviceName: service.name,
      serviceId: service.id,
      date: new Date(orders.booked_date || orders.date),
      time: orders.booked_time || orders.time || "00:00",
      duration: service.duration,
      status: (orders.booking_status ||
        orders.status ||
        "pending") as AppointmentStatus,
      paymentStatus: (orders.payment_status || "pending") as any,
      price: service.price,
      notes: orders.notes || "",
      order,
      event: orders.event || "",
      createdAt: new Date(orders.created_at),
      updatedAt: new Date(orders.updated_at),
    };
  }, []);

  // Fetch appointments with proper error handling
  const fetchAppointments = useCallback(
    async (page = 1, search = "", date?: string) => {
      try {
        setLoading(true);
        const response = await getAppointmentsPaginated(
          page,
          itemsPerPage,
          search,
          date
        );

        if (!response?.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data: AppointmentsResponse = await response.json();

        if (data.status && data.data) {
          const appointmentsList = data.data.orders || [];
          const transformedAppointments =
            appointmentsList.map(transformAppointment);

          setAppointments(transformedAppointments);
          setPagination(data.data.pagination || null);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, itemsPerPage, transformAppointment]
  );

  // Effect for fetching data
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const dateParam = searchParams.get("date");

    if (dateParam) {
      setSelectedDate(new Date(dateParam));
    }

    fetchAppointments(page, debouncedSearchTerm, dateParam || undefined);
  }, [debouncedSearchTerm, searchParams, fetchAppointments]);

  // Navigation handlers
  const handleViewChange = useCallback(
    (view: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", view);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleDateFilter = useCallback(
    (date: Date | undefined) => {
      setSelectedDate(date);
      const params = new URLSearchParams(searchParams.toString());

      if (date) {
        params.set("date", date.toISOString().split("T")[0]);
      } else {
        params.delete("date");
      }

      params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  // Status update handler
  const handleStatusUpdate = useCallback(
    async (appointmentId: string, newStatus: AppointmentStatus) => {
      try {
        let response;

        switch (newStatus) {
          case "completed":
            response = await bookingCompleteHandler(appointmentId);
            break;
          case "inprogress":
            response = await bookingInprogressHandler(appointmentId);
            break;
          case "cancelled":
            response = await cancelBookingHandler(appointmentId);
            break;
          default:
            throw new Error("Invalid status update");
        }

        if (response?.ok) {
          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === appointmentId ? { ...apt, status: newStatus } : apt
            )
          );

          toast({
            title: "Success",
            description: `Appointment ${newStatus.replace(
              "_",
              " "
            )} successfully`,
          });
        } else {
          throw new Error("Failed to update appointment status");
        }
      } catch (error) {
        console.error("Error updating appointment:", error);
        toast({
          title: "Error",
          description: "Failed to update appointment status. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // View appointment details
  const handleViewAppointment = useCallback((appointment: Appointment) => {
    setViewingAppointment(appointment);
  }, []);

  // Status badge helper
  const getStatusBadge = useCallback((status: AppointmentStatus) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      confirmed: { color: "bg-blue-100 text-blue-800", label: "Confirmed" },
      inprogress: {
        color: "bg-orange-100 text-orange-800",
        label: "In Progress",
      },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
      rescheduled: {
        color: "bg-purple-100 text-purple-800",
        label: "Rescheduled",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  }, []);

  // Filter appointments based on selected status
  const filteredAppointments = useMemo(() => {
    if (selectedStatus.includes("all")) {
      return appointments;
    }
    return appointments.filter((appointment) =>
      selectedStatus.includes(appointment.status)
    );
  }, [appointments, selectedStatus]);

  // Table columns definition
  const columns: ColumnDef<Appointment>[] = useMemo(
    () => [
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/assets/images/image-placeholder.png" />
              <AvatarFallback>
                {row.original.customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.customerName}</div>
              <div className="text-sm text-gray-500">
                {row.original.customerEmail}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "serviceName",
        header: "Service",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.serviceName}</div>
            <div className="text-sm text-gray-500">${row.original.price}</div>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date & Time",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.date.toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">
              {row.original.time} ({row.original.duration}min)
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const appointment = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleViewAppointment(appointment)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>

                {appointment.status === "pending" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusUpdate(appointment.id, "confirmed")
                    }
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm
                  </DropdownMenuItem>
                )}

                {appointment.status === "confirmed" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusUpdate(appointment.id, "inprogress")
                    }
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Service
                  </DropdownMenuItem>
                )}

                {appointment.status === "inprogress" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusUpdate(appointment.id, "completed")
                    }
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Complete
                  </DropdownMenuItem>
                )}

                {(appointment.status === "pending" ||
                  appointment.status === "confirmed") && (
                  <DropdownMenuItem
                    onClick={() => setRescheduleAppointment(appointment)}
                  >
                    <Clock2 className="mr-2 h-4 w-4" />
                    Reschedule
                  </DropdownMenuItem>
                )}

                {appointment.status !== "completed" &&
                  appointment.status !== "cancelled" && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusUpdate(appointment.id, "cancelled")
                      }
                      className="text-red-600"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel
                    </DropdownMenuItem>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [getStatusBadge, handleViewAppointment, handleStatusUpdate]
  );

  // Table setup
  const table = useReactTable({
    data: filteredAppointments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Pagination component
  const PaginationComponent = () => {
    if (!pagination || pagination.last_page <= 1) return null;

    return (
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {pagination.from} to {pagination.to} of {pagination.total}{" "}
          results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from(
              { length: Math.min(5, pagination.last_page) },
              (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              }
            )}

            {pagination.last_page > 5 && (
              <>
                <span className="text-sm text-muted-foreground">...</span>
                <Button
                  variant={
                    currentPage === pagination.last_page ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handlePageChange(pagination.last_page)}
                  className="w-8 h-8 p-0"
                >
                  {pagination.last_page}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pagination.last_page}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Appointments</h1>
        </div>
        <AppointmentSkeletonList count={6} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Appointments</h1>
          <p className="text-gray-600 mt-1">
            Manage your service appointments (
            {pagination?.total || appointments.length} total)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={currentView === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("list")}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={currentView === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("calendar")}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-1.5">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <AppointmentFilters
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedDate={selectedDate}
              onDateChange={handleDateFilter}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={currentView}
        onValueChange={handleViewChange}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No appointments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <PaginationComponent />
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView
            appointments={filteredAppointments}
            onStatusUpdate={handleStatusUpdate}
            onViewDetails={handleViewAppointment}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {rescheduleAppointment && (
        <RescheduleDialog
          appointment={rescheduleAppointment}
          open={true}
          onOpenChange={() => setRescheduleAppointment(null)}
          onSuccess={() => {
            setRescheduleAppointment(null);
            fetchAppointments(currentPage, debouncedSearchTerm);
          }}
        />
      )}

      {viewingAppointment && (
        <AppointmentDetailsDialog
          appointment={viewingAppointment}
          open={true}
          onOpenChange={() => setViewingAppointment(null)}
          onUpdate={(updatedAppointment) => {
            setAppointments((prev) =>
              prev.map((apt) =>
                apt.id === updatedAppointment.id ? updatedAppointment : apt
              )
            );
            setViewingAppointment(null);
          }}
        />
      )}
    </div>
  );
}
