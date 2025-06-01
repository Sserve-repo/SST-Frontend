"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ServicesForm } from "./services-form";
import type { Service } from "@/types/services";

interface CreateServiceDialogProps {
  children: React.ReactNode;
  onSubmit: (service: Omit<Service, "id">) => void | Promise<void>;
}

export function CreateServiceDialog({
  children,
  onSubmit,
}: CreateServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<Service>) => {
    setIsSubmitting(true);
    try {
      // Validate that all required fields except "id" are present
      const { id, ...rest } = data;
      if (!rest.name || !rest.description || !rest.duration || !rest.price) {
        console.log({ id });
        throw new Error("All fields are required.");
      }
      // Type assertion since we've checked required fields
      await onSubmit(rest as Omit<Service, "id">);
      setOpen(false);
    } catch (error) {
      console.error("Error creating service :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">
            Create New Service
          </DialogTitle>
          <DialogDescription>
            Add a new service to your offerings. Fill in all the required
            details to get started.
          </DialogDescription>
        </DialogHeader>
        <ServicesForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
