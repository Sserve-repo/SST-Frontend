"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "./service-form";
import type { Service } from "@/types/service";
import { useToast } from "@/hooks/use-toast";
import { updateService } from "@/actions/admin/service-api";

interface EditServiceDialogProps {
  service: Service | null;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function EditServiceDialog({
  service,
  onOpenChange,
  onRefresh,
}: EditServiceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!service) return null;

  const handleSubmit = async (data: Partial<Service>) => {
    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add text fields
      if (data.name) formData.append("title", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.price) formData.append("price", data.price.toString());
      if (data.category) formData.append("category", data.category);
      if (data.duration)
        formData.append("service_duration", data.duration.toString());

      // Handle images if they're files
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          if (
            typeof window !== "undefined" &&
            typeof File !== "undefined" &&
            (image as any) instanceof File
          ) {
            formData.append(`images[${index}]`, image);
          }
        });
      }

      const { error } = await updateService(service.id!, formData);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "Service updated successfully.",
      });

      onRefresh?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update service:", error);
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
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
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <ServiceForm
          service={service}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
