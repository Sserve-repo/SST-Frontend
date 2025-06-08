"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/services";
import { useToast } from "@/hooks/use-toast";
import ImageShowCase from "@/components/ImageShowCase";
import { updateServiceStatus } from "@/actions/admin/service-api";

interface ServiceDetailsDialogProps {
  service: Service | null;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function ServiceDetailsDialog({
  service,
  onOpenChange,
  onRefresh,
}: ServiceDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!service) return null;

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    setIsLoading(true);

    try {
      const { error } = await updateServiceStatus({
        status,
        service_ids: [Number.parseInt(service.id!)],
      });

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: `Service ${status} successfully.`,
      });

      onRefresh?.();
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${status} service:`, error);
      toast({
        title: "Error",
        description: `Failed to ${status} service. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!service} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Service Details</DialogTitle>
          <DialogDescription>
            Review the service details and take action if needed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="rounded-lg overflow-hidden bg-muted">
            <ImageShowCase shots={service.images} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <div className="flex items-center gap-2">
                {service.featured && (
                  <Badge variant="outline" className="text-yellow-600">
                    <Star className="mr-1 h-3 w-3" />
                    Featured
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={cn(
                    service.status === "approved" &&
                      "bg-green-100 text-green-600",
                    service.status === "pending" &&
                      "bg-yellow-100 text-yellow-600",
                    service.status === "rejected" && "bg-red-100 text-red-600"
                  )}
                >
                  {service.status}
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground">{service.description}</p>
          </div>

          <div className="grid gap-4 text-sm">
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Category</span>
              <span>{service.category}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Price</span>
              <span className="font-semibold">
                $
                {typeof service.price === "number"
                  ? service.price.toFixed(2)
                  : service.price}
              </span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Duration</span>
              <span className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {service.duration} hours
              </span>
            </div>
            {service.homeService && (
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">Home Service</span>
                <Badge variant="outline" className="text-green-600">
                  Available
                </Badge>
              </div>
            )}
            {service.vendor && (
              <>
                <div className="flex justify-between border-b py-2">
                  <span className="font-medium">Vendor</span>
                  <span>{service.vendor.name}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="font-medium">Vendor Email</span>
                  <span className="text-blue-600">{service.vendor.email}</span>
                </div>
              </>
            )}
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Created Date</span>
              <span>{new Date(service.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Featured</span>
              <span>{service.featured ? "Yes" : "No"}</span>
            </div>
          </div>

          {service.status === "pending" && (
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleStatusUpdate("rejected")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <X className="mr-2 h-4 w-4" />
                )}
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate("approved")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Approve
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
