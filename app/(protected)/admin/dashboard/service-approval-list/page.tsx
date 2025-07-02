"use client";

import { useState, useEffect, useCallback } from "react";
import { BulkActionsToolbar } from "@/components/admin/services/bulk-actions-toolbar";
import { ServiceTable } from "@/components/admin/services/service-table";
import { ServiceFilters } from "@/components/admin/services/service-filters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { Button } from "@/components/ui/button";
import type { Service as IService } from "@/types/services";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle, Wrench } from "lucide-react";
import {
  getServices,
  updateServiceStatus,
  disableServices,
  type Service,
} from "@/actions/admin/service-api";
import { useUrlFilters } from "@/hooks/use-url-filters";

interface ServiceStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  disabled: number;
}

export default function ServiceApprovalPage() {
  const { filters, updateFilters, clearFilters } = useUrlFilters();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [stats, setStats] = useState<ServiceStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    disabled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10,
  });

  const { toast } = useToast();

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

      const params: Record<string, string> = {};

      // Only add non-empty filter values
      if (filters.page && filters.page !== "1") params.page = filters.page;
      if (filters.limit && filters.limit !== "10") params.limit = filters.limit;
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const { data, error: apiError } = await getServices(params);

      if (apiError || !data?.serviceListing) {
        throw new Error(apiError || "No services found");
      }

      const apiData = data;
      const formattedServices: any[] = apiData.serviceListing.map(
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
          status: getStatusFromNumber(service.status) as IService["status"],
          featured: Boolean(service.featured),
          images: service.image
            ? [service.image]
            : ["/assets/images/image-placeholder.png"],
          createdAt: service.created_at,
          duration: Number.parseFloat(service.service_duration) || 0,
          availability: Array.isArray(service.available_dates)
            ? (service.available_dates as string[])
            : service.available_dates
            ? ([service.available_dates] as string[])
            : [],
          homeService: Boolean(service.home_service_availability),
          // Add missing properties for Service type
          rating: typeof service.rating === "number" ? service.rating : 0,
          reviewCount:
            typeof service.reviewCount === "number" ? service.reviewCount : 0,
          bookingCount:
            typeof service.bookingCount === "number" ? service.bookingCount : 0,
          updatedAt: service.updated_at || service.created_at,
        })
      );

      setServices(formattedServices);

      // Update pagination from API response
      setPagination({
        currentPage: data.current_page || Number.parseInt(filters.page) || 1,
        totalPages: data.last_page || 1,
        total: data.total || formattedServices.length,
        perPage: data.per_page || Number.parseInt(filters.limit) || 10,
      });

      // Update stats
      if (apiData.listingCounts) {
        setStats({
          total: apiData.listingCounts.allServices || 0,
          pending: apiData.listingCounts.pendingServices || 0,
          approved: apiData.listingCounts.approvedServices || 0,
          rejected: apiData.listingCounts.rejectedServices || 0,
          disabled: apiData.listingCounts.disabledServices || 0,
        });
      } else {
        calculateStats(formattedServices);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.page,
    filters.limit,
    filters.category,
    filters.status,
    filters.search,
  ]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const calculateStats = (serviceList: IService[]) => {
    const newStats = {
      total: serviceList.length,
      pending: serviceList.filter(
        (s) => s.status === ("pending" as IService["status"])
      ).length,
      approved: serviceList.filter(
        (s) => s.status === ("approved" as IService["status"])
      ).length,
      rejected: serviceList.filter(
        (s) => s.status === ("rejected" as IService["status"])
      ).length,
      disabled: serviceList.filter(
        (s) => s.status === ("disabled" as IService["status"])
      ).length,
    };
    setStats(newStats);
  };

  const handleFiltersChange = useCallback(
    (newFilters: { category: string; status: string; search: string }) => {
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page: page.toString() });
    },
    [updateFilters]
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
            <p className="text-xs text-muted-foreground">Inactive services</p>
          </CardContent>
        </Card>
      </div>

      <ServiceFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
        onClearFilters={clearFilters}
      />

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
          <Button variant="link" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ServiceTable
          services={services}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          onRefresh={fetchServices}
          isLoading={isUpdating}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
