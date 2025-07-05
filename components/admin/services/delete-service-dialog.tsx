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
import type { Service } from "@/types/service";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { disableServices } from "@/actions/admin/service-api";

interface DeleteServiceDialogProps {
  service: Service | null;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function DeleteServiceDialog({
  service,
  onOpenChange,
  onRefresh,
}: DeleteServiceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!service) return null;

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const { error } = await disableServices([Number.parseInt(service.id!)]);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "Service deleted successfully.",
      });

      onRefresh?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Service
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
