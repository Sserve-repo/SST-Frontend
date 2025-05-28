"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ServicesForm } from "./services-form";
import type { Service } from "@/types/services";
import { useState } from "react";

interface EditServicesDialogProps {
  service: Service | null;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (updatedService: Service) => void;
}

export function EditServicesDialog({
  service,
  onOpenChange,
  onUpdate,
}: EditServicesDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!service) return null;

  const handleSubmit = async (data: Partial<Service>) => {
    setIsSubmitting(true);
    try {
      const updatedService = { ...service, ...data };

      if (onUpdate) {
        await onUpdate(updatedService);
      } else {
        console.log("Updating service:", updatedService);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={!!service} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update your service details, pricing, and availability. Changes will
            be reflected immediately.
          </DialogDescription>
        </DialogHeader>
        <ServicesForm
          service={service}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
