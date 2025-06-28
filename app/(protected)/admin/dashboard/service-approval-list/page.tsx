"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BulkActionsToolbar } from "@/components/admin/services/bulk-actions-toolbar";
import { ServiceTable } from "@/components/admin/services/service-table";
import { ServiceFilters } from "@/components/admin/services/service-filters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { Button } from "@/components/ui/button";
import type { Service as IService } from "@/types/services";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  XCircle,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getServices,
  updateServiceStatus,
  disableServices,
  type Service,
} from "@/actions/admin/service-api";

interface ServiceStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  disabled: number;
}

interface Filters {
  category: string;
  status: string;
  search: string;
}

export default function ServiceApprovalPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [stats, setStats] = useState<ServiceStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    disabled: 0,
  });

  // Get initial values from URL
  const [filters, setFilters] = useState<Filters>({
    category: searchParams.get("category") || "",
    status: searchParams.get("status") || "",
    search: searchParams.get("search") || "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  const { toast } = useToast();

  // Update URL when filters or pagination change
  const updateURL = useCallback(
    (newFilters: Filters, newPage: number) => {
      const params = new URLSearchParams();

      if (newFilters.category) params.set("category", newFilters.category);
      if (newFilters.status) params.set("status", newFilters.status);
      if (newFilters.search) params.set("search", newFilters.search);
      if (newPage > 1) params.set("page", newPage.toString());

      const newURL = `${pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      router.replace(newURL, { scroll: false });
    },
    [pathname, router]
  );

  const getStatusFromNumber = (
    status: number
  ): "pending" | "approved" | "rejected" | "disabled" => {
    switch (status) {
      case 1:
        return "approved";
      case 2:
        return "rejected";
      case 3:
        return "disabled";
      default:
        return "pending";
    }
  };

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: pageSize.toString(),
      };

      if (filters.category) params.service_category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const { data, error: apiError } = await getServices(params);

      if (apiError) {
        throw new Error(apiError);
      }

      if (data?.serviceListing) {
        const formattedServices: IService[] = data.serviceListing.map(
          (service: Service) => ({
            id: service.id.toString(),
            name: service.title,
            description: service.description,
            category: service.service_category?.name || "Uncategorized",
            price: Number.parseFloat(service.price),
            vendor: {
              id: service.user_id.toString(),
              name: service.vendor_name || "Unknown Vendor",
              email: service.vendor_email || "",
            },
            status: getStatusFromNumber(service.status),
            featured: Boolean(service.is_featured),
            images: service.image
              ? [service.image]
              : ["/assets/images/image-placeholder.png"],
            createdAt: service.created_at,
            duration: Number.parseInt(service.service_duration) || 0,
            availability: Array.isArray(service.available_dates)
              ? service.available_dates.join(", ")
              : service.available_dates
              ? service.available_dates
              : "",
            homeService: Boolean(service.home_service_availability),
          })
        );

        setServices(formattedServices);

        // Set pagination info
        setTotalItems(data.total || 0);
        setTotalPages(data.last_page || 1);

        // Use API counts if available, otherwise calculate from filtered results
        if (data.listingCounts) {
          setStats({
            total: data.listingCounts.allServices || 0,
            pending: data.listingCounts.pendingServices || 0,
            approved: data.listingCounts.approvedServices || 0,
            rejected: data.listingCounts.rejectedServices || 0,
            disabled: data.listingCounts.disabledServices || 0,
          });
        } else {
          calculateStats(formattedServices);
        }
      } else {
        setServices([]);
        setStats({
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          disabled: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const calculateStats = (serviceList: IService[]) => {
    const newStats = {
      total: serviceList.length,
      pending: serviceList.filter((s) => s.status === "pending").length,
      approved: serviceList.filter((s) => s.status === "approved").length,
      rejected: serviceList.filter((s) => s.status === "rejected").length,
      disabled: serviceList.filter((s) => s.status === "disabled").length,
    };
    setStats(newStats);
  };

  const handleFiltersChange = useCallback(
    (newFilters: Filters) => {
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change
      updateURL(newFilters, 1);
    },
    [updateURL]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      updateURL(filters, newPage);
    },
    [filters, updateURL]
  );

  const handleBulkAction = async (
    action: "approve" | "reject" | "disable" | "feature"
  ) => {
    if (selectedIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select services to perform this action.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const serviceIds = selectedIds.map((id) => Number.parseInt(id));
      let result;

      switch (action) {
        case "approve":
        case "reject":
          result = await updateServiceStatus({
            status: action === "approve" ? "approved" : "rejected",
            service_ids: serviceIds,
          });
          break;
        case "disable":
          result = await disableServices(serviceIds);
          break;
        case "feature":
          toast({
            title: "Feature",
            description: "Feature functionality coming soon.",
          });
          return;
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: `${selectedIds.length} service(s) ${action}d successfully.`,
      });

      setSelectedIds([]);
      await fetchServices();
    } catch (err) {
      console.error(`Failed to ${action} services:`, err);
      toast({
        title: "Error",
        description: `Failed to ${action} services. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Service Approval
        </h1>
        <p className="text-muted-foreground">
          Review and manage service listings awaiting approval
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All service listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <p className="text-xs text-muted-foreground">Live services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <p className="text-xs text-muted-foreground">Declined services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disabled</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.disabled}
            </div>
            <p className="text-xs text-muted-foreground">Disabled services</p>
          </CardContent>
        </Card>
      </div>

      <ServiceFilters onFiltersChange={handleFiltersChange} />

      {selectedIds.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onApprove={() => handleBulkAction("approve")}
          onReject={() => handleBulkAction("reject")}
          onDisable={() => handleBulkAction("disable")}
          onFeature={() => handleBulkAction("feature")}
          isLoading={isUpdating}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchServices} />
      ) : services.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">
            No services found matching your criteria.
          </p>
          <Button
            variant="link"
            onClick={() =>
              handleFiltersChange({ category: "", status: "", search: "" })
            }
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <ServiceTable
            services={services}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            onRefresh={fetchServices}
            isLoading={isUpdating}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="flex-1 text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
                services
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
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-muted-foreground">...</span>
                      <Button
                        variant={
                          currentPage === totalPages ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
