"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import { IProduct } from "@/types/product";

interface EditProductDialogProps {
  product: IProduct | null;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({
  product,
  onOpenChange,
}: EditProductDialogProps) {
  if (!product) return null;

  const handleSubmit = (data: Partial<IProduct>) => {
    // Handle product update here
    console.log("Updating product:", { ...data, id: product.id });
    onOpenChange(false);
  };

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <ProductForm product={product} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
