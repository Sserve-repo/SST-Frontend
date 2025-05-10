"use client";

import { deleteServiceListing } from "@/actions/dashboard/artisans";
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
  onDelete: (id: string) => void;
}

export function DeleteServiceDialog({
  service,
  onOpenChange,
  onDelete,
}: DeleteServiceDialogProps) {
  if (!service) return null;

  const handleDelete = async () => {
    console.log("entering here.....");
    await deleteServiceListing(service.id);
    onDelete(service.id as string)
    onOpenChange(false)
  };

  return (
    <AlertDialog open={!!service} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the service &quot;{service.name}&quot;.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
