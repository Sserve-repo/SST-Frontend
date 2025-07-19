"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
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
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounced-search";
import { AppointmentSkeletonList } from "../appointments/appointment-skeleton-list";
import { CreateServiceDialog } from "./create-service-dialog";
import { EditServicesDialog } from "./edit-services-dialog";
import { ServiceDetailsDialog } from "./service-details-dialog";
import { ServiceReviewPreviewSheet } from "./service-review-preview-sheet";
import {
  getServices,
  getServiceDetails,
  deleteServiceListing,
} from "@/actions/dashboard/artisans";
import type { Service, ServiceStatus } from "@/types/services";

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface ServicesResponse {
  status: boolean;
  data: {
    serviceListing: any[];
    pagination?: PaginationData;
  };
  message?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [reviewingService, setReviewingService] = useState<Service | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const currentPage = Number(searchParams.get("page")) || 1;

  // Transform service data helper function
  const transformService = (service: any): Service => ({
    id: String(service.id),
    name:
      service.title ||
      service.service_name ||
      service.name ||
      "Untitled Service",
    title:
      service.title ||
      service.service_name ||
      service.name ||
      "Untitled Service",
    description: service.description || "",
    price: Number(service.price) || 0,
    duration: Number(service.service_duration) || 60,
    category: service.category || "General",
    status: (service.status === 1 ? "active" : "inactive") as ServiceStatus,
    images: service.image ? [service.image] : [],
    availability: service.availability || [],
    rating: Number(service.rating) || 0,
    reviewCount: Number(service.review_count) || 0,
    bookingCount: Number(service.booking_count) || 0,
    createdAt: new Date(service.created_at || Date.now()),
    updatedAt: new Date(service.updated_at || Date.now()),
    // Preserve original API fields for edit dialog
    service_category_id: service.service_category_id,
    service_category_items_id: service.service_category_items_id,
    service_duration: service.service_duration,
    image: service.image,
    start_time: service.start_time,
    end_time: service.end_time,
    home_service_availability: service.home_service_availability,
  });

  // Fetch services function
  const fetchServices = useCallback(async (page: number, search: string) => {
    try {
      setLoading(true);
      const response = await getServices(page, 10, search);

      if (!response?.ok) {
        throw new Error("Failed to fetch services");
      }

      const data: ServicesResponse = await response.json();
      console.log("Fetched services data:", data);

      if (data.status && data.data) {
        const servicesList = data.data.serviceListing || data.data || [];
        const transformedServices: Service[] =
          servicesList.map(transformService);

        setServices(transformedServices);
        setPagination(data.data.pagination || null);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Effect for fetching services
  useEffect(() => {
    fetchServices(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    router.push(`?${params.toString()}`);
  };

  // Handle delete service
  const handleDeleteService = useCallback(async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await deleteServiceListing(serviceId);
      if (response?.ok) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
        // Refresh the current page
        fetchServices(currentPage, debouncedSearchTerm);
      } else {
        throw new Error("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, fetchServices, currentPage, debouncedSearchTerm]);

  // Handle view service
  const handleViewService = useCallback(async (serviceId: string) => {
    try {
      const response = await getServiceDetails(serviceId);
      if (response?.ok) {
        const data = await response.json();
        console.log("Fetched service details:", data);
        if (data.status && data.data) {
          const transformedService = transformService(
            data.data.serviceListing || data.data
          );
          setViewingService(transformedService);
        }
      }
    } catch (error) {
      console.error("Error fetching service details:", error);
      toast({
        title: "Error",
        description: "Failed to load service details.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Handle edit service
  const handleEditService = useCallback((serviceId: string) => {
    setEditingServiceId(serviceId);
  }, []);

  // Handle view reviews
  const handleViewReviews = (service: Service) => {
    setReviewingService(service);
  };

  // Handle create service success
  const handleCreateService = () => {
    fetchServices(currentPage, debouncedSearchTerm);
  };

  // Handle update service success
  const handleUpdateService = () => {
    setEditingServiceId(null);
    fetchServices(currentPage, debouncedSearchTerm);
  };

  // Get status badge
  const getStatusBadge = (status: ServiceStatus) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      draft: { color: "bg-yellow-100 text-yellow-800", label: "Draft" },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const mapStatusToServiceStatus = (status: string | number): ServiceStatus => {
    const statusStr = String(status);
    if (statusStr === "1") return "active";
    if (statusStr === "0") return "inactive";
    if (statusStr === "draft") return "draft";
    if (statusStr === "active") return "active";
    if (statusStr === "inactive") return "inactive";
    return "inactive"; // default
  };

  // Memoized columns definition
  const columns: ColumnDef<Service>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Service",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage
                src={
                  row.original.images[0] ||
                  "/placeholder.svg?height=48&width=48"
                }
              />
              <AvatarFallback className="rounded-lg">
                {row.original.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-sm text-gray-500 line-clamp-1">
                {row.original.description}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
            <span className="font-medium">${row.original.price}</span>
          </div>
        ),
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{row.original.duration}min</span>
          </div>
        ),
      },
      {
        accessorKey: "bookingCount",
        header: "Bookings",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.bookingCount}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(mapStatusToServiceStatus(row.original.status)),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const service = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewService(service.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditService(service.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewReviews(service)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Reviews ({service.reviewCount})
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteService(service.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDeleteService, handleEditService, handleViewService]
  );

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (statusFilter === "all") return true;
      return service.status === statusFilter;
    });
  }, [services, statusFilter]);

  // Table configuration
  const table = useReactTable({
    data: filteredServices,
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
    if (!pagination) return null;

    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(
      pagination.last_page,
      startPage + maxVisiblePages - 1
    );

    return (
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {pagination.from || 0} to {pagination.to || 0} of{" "}
          {pagination.total || 0} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
              const page = startPage + i;
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
            })}
            {endPage < pagination.last_page && (
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
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">
            Manage your service offerings (
            {pagination?.total || services.length} total)
          </p>
        </div>
        <CreateServiceDialog onSubmit={handleCreateService}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </CreateServiceDialog>
      </div>

      {/* Filters */}
      <div className="p-1.5 rounded">
        <div className="flex flex-col items-center justify-between sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Services Table */}
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
                  No services found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationComponent />

      {/* Dialogs */}
      {editingServiceId && (
        <EditServicesDialog
          serviceId={editingServiceId}
          open={!!editingServiceId}
          onOpenChange={(open) => !open && setEditingServiceId(null)}
          onUpdate={handleUpdateService}
        />
      )}

      {viewingService && (
        <ServiceDetailsDialog
          service={viewingService}
          open={true}
          onOpenChange={(open) => !open && setViewingService(null)}
        />
      )}

      {reviewingService && (
        <ServiceReviewPreviewSheet
          service={reviewingService}
          open={true}
          onOpenChange={(open) => !open && setReviewingService(null)}
        />
      )}
    </div>
  );
}
