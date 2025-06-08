"use client";

import { useState, useEffect } from "react";
import { BulkActionsToolbar } from "@/components/admin/services/bulk-actions-toolbar";
import { ServiceTable } from "@/components/admin/services/service-table";
import { ServiceFilters } from "@/components/admin/services/service-filters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import type { Service as IService } from "@/types/services";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle, Wrench } from "lucide-react";
import {
  getServices,
  updateServiceStatus,
  deleteServices,
  type Service,
} from "@/actions/admin/service-api";

interface ServiceStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function ServiceApprovalPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [stats, setStats] = useState<ServiceStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      // setLoading(true);
      setError(null);

      const { data, error: apiError } = await getServices({
        service_category: filters.category || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      });

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
            featured: false, // This would come from the API if available
            images: service.image ? [service.image] : ["/placeholder.svg"],
            createdAt: service.created_at,
            duration: Number.parseInt(service.service_duration) || 0,
            availability: Array.isArray(service.available_dates)
              ? service.available_dates.join(", ")
              : service.available_dates || "",
            homeService: Boolean(service.home_service_availability),
          })
        );

        setServices(formattedServices);
        calculateStats(formattedServices);
      } else {
        throw new Error("No service data received");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      // setError(err instanceof Error ? err.message : "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const getStatusFromNumber = (
    status: number
  ): "pending" | "approved" | "rejected" => {
    switch (status) {
      case 1:
        return "approved";
      case 2:
        return "rejected";
      default:
        return "pending";
    }
  };

  const calculateStats = (serviceList: IService[]) => {
    const newStats = {
      total: serviceList.length,
      pending: serviceList.filter((s) => s.status === "pending").length,
      approved: serviceList.filter((s) => s.status === "approved").length,
      rejected: serviceList.filter((s) => s.status === "rejected").length,
    };
    setStats(newStats);
  };

  const handleBulkAction = async (
    action: "approve" | "reject" | "delete" | "feature"
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
        case "delete":
          result = await deleteServices(serviceIds);
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

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      !filters.category || service.category === filters.category;
    const matchesStatus = !filters.status || service.status === filters.status;
    const matchesSearch =
      !filters.search ||
      service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      service.vendor?.name.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchServices} />;
  }

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>

      <ServiceFilters onFiltersChange={setFilters} />

      {selectedIds.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onApprove={() => handleBulkAction("approve")}
          onReject={() => handleBulkAction("reject")}
          onDelete={() => handleBulkAction("delete")}
          onFeature={() => handleBulkAction("feature")}
          isLoading={isUpdating}
        />
      )}

      <ServiceTable
        services={filteredServices}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        onRefresh={fetchServices}
        isLoading={isUpdating}
      />
    </div>
  );
}
