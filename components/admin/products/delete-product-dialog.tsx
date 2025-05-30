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
import type { IProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { deleteProducts } from "@/actions/admin/product-api";

interface DeleteProductDialogProps {
  product: IProduct | null;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function DeleteProductDialog({
  product,
  onOpenChange,
  onRefresh,
}: DeleteProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!product) return null;

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const { error } = await deleteProducts([Number.parseInt(product.id!)]);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });

      onRefresh?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={!!product} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{product.name}&quot;? This
            action cannot be undone and will permanently remove the product from
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
            Delete Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
