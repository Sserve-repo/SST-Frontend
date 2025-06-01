"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Service } from "@/types/services";

interface DeleteServiceDialogProps {
  service: Service | null;
  onOpenChange: (open: boolean) => void;
  onDelete: (serviceId: string) => void;
}

export function DeleteServiceDialog({
  service,
  onOpenChange,
  onDelete,
}: DeleteServiceDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!service) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (service.id) {
        onDelete(service.id);
      } else {
        throw new Error("Service ID is undefined.");
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={!!service} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Service</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{service.name}&quot;? This
            action cannot be undone and will permanently remove the service from
            the platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Service"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
