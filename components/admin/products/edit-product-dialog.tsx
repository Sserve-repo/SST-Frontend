"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import type { IProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { updateProduct } from "@/actions/admin/product-api";

interface EditProductDialogProps {
  product: IProduct | null;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function EditProductDialog({
  product,
  onOpenChange,
  onRefresh,
}: EditProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!product) return null;

  const handleSubmit = async (data: Partial<IProduct>) => {
    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add text fields
      if (data.name) formData.append("title", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.price) formData.append("price", data.price.toString());
      if (data.category) formData.append("category", data.category);

      // Handle images if they're files
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }

      const { error } = await updateProduct(product.id!, formData);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "Product updated successfully.",
      });

      onRefresh?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
