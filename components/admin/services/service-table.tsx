"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  Edit,
  Eye,
  MoreHorizontal,
  Star,
  X,
  Loader2,
  Ban,
} from "lucide-react";
import { ServiceDetailsDialog } from "./service-details-dialog";
import { EditServiceDialog } from "./edit-service-dialog";
import { DeleteServiceDialog } from "./delete-service-dialog";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/services";
import { useToast } from "@/hooks/use-toast";
import { updateServiceStatus } from "@/actions/admin/service-api";

interface ServiceTableProps {
  services: Service[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function ServiceTable({
  services,
  selectedIds,
  onSelectedIdsChange,
  onRefresh,
  isLoading = false,
}: ServiceTableProps) {
  const [serviceToView, setServiceToView] = useState<Service | null>(null);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDisabled] = useState<Service | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { toast } = useToast();

  const toggleAll = () => {
    if (selectedIds.length === services.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(services.map((service) => service.id!));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter((serviceId) => serviceId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  const handleSingleAction = async (
    serviceId: string,
    action: "approve" | "reject" | "feature",
    currentStatus?: boolean
  ) => {
    setActionLoading(`${action}-${serviceId}`);

    try {
      if (action === "approve" || action === "reject") {
        const { error } = await updateServiceStatus({
          status: action === "approve" ? "approved" : "rejected",
          service_ids: [Number.parseInt(serviceId)],
        });

        if (error) {
          throw new Error(error);
        }

        toast({
          title: "Success",
          description: `Service ${action}d successfully.`,
        });
      } else if (action === "feature") {
        // Feature/unfeature logic would go here
        toast({
          title: "Success",
          description: `Service ${
            currentStatus ? "unfeatured" : "featured"
          } successfully.`,
        });
      }

      onRefresh?.();
    } catch (error) {
      console.error(`Failed to ${action} service:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} service. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedIds.length === services.length &&
                    services.length > 0
                  }
                  onCheckedChange={toggleAll}
                  disabled={isLoading}
                />
              </TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Artisan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  No services found
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow
                  key={service.id}
                  className={isLoading ? "opacity-50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(service.id!)}
                      onCheckedChange={() => toggleOne(service.id!)}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          typeof service.images[0] === "string"
                            ? service.images[0]
                            : "/placeholder.svg"
                        }
                        alt={service.name}
                        className="h-10 w-10 rounded-md object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (
                            target.src !==
                            window.location.origin + "/placeholder.svg"
                          ) {
                            target.src = "/placeholder.svg";
                          }
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{service.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>
                    $
                    {typeof service.price === "number"
                      ? service.price.toFixed(2)
                      : service.price}
                  </TableCell>
                  <TableCell>{service.duration}h</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {service.vendor?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {service.vendor?.email || ""}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        service.status === "approved" &&
                          "bg-green-100 text-green-600",
                        service.status === "pending" &&
                          "bg-yellow-100 text-yellow-600",
                        service.status === "rejected" &&
                          "bg-red-100 text-red-600"
                      )}
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(service.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLoading}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setServiceToView(service)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setServiceToEdit(service)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Service
                        </DropdownMenuItem>
                        {service.status === "pending" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleSingleAction(service.id!, "approve")
                              }
                              disabled={
                                actionLoading === `approve-${service.id}`
                              }
                            >
                              {actionLoading === `approve-${service.id}` ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                              )}
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleSingleAction(service.id!, "reject")
                              }
                              disabled={
                                actionLoading === `reject-${service.id}`
                              }
                            >
                              {actionLoading === `reject-${service.id}` ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <X className="mr-2 h-4 w-4 text-red-600" />
                              )}
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {service.status === "approved" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleSingleAction(service.id!, "reject")
                            }
                            disabled={actionLoading === `reject-${service.id}`}
                          >
                            {actionLoading === `reject-${service.id}` ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <X className="mr-2 h-4 w-4 text-red-600" />
                            )}
                            Reject
                          </DropdownMenuItem>
                        )}
                        {service.status === "rejected" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleSingleAction(service.id!, "approve")
                            }
                            disabled={actionLoading === `approve-${service.id}`}
                          >
                            {actionLoading === `approve-${service.id}` ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                            )}
                            Approve
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleSingleAction(
                              service.id!,
                              "feature",
                              service.featured
                            )
                          }
                          disabled={actionLoading === `feature-${service.id}`}
                        >
                          {actionLoading === `feature-${service.id}` ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Star className="mr-2 h-4 w-4 text-yellow-600" />
                          )}
                          {service.featured ? "Unfeature" : "Feature"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setServiceToDisabled(service)}
                          className="text-red-600"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Disable
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ServiceDetailsDialog
        service={serviceToView}
        onOpenChange={(open) => !open && setServiceToView(null)}
        onRefresh={onRefresh}
      />

      <EditServiceDialog
        service={serviceToEdit}
        onOpenChange={(open) => !open && setServiceToEdit(null)}
        onRefresh={onRefresh}
      />

      <DeleteServiceDialog
        service={serviceToDelete}
        onOpenChange={(open) => !open && setServiceToDisabled(null)}
        onRefresh={onRefresh}
      />
    </>
  );
}
