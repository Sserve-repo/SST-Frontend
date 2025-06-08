"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import ImageShowCase from "@/components/ImageShowCase";
import { updateProductStatus } from "@/actions/admin/product-api";

interface ProductDetailsDialogProps {
  product: IProduct | null;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function ProductDetailsDialog({
  product,
  onOpenChange,
  onRefresh,
}: ProductDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!product) return null;

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    setIsLoading(true);

    try {
      const { error } = await updateProductStatus({
        status,
        product_ids: [Number.parseInt(product.id!)],
      });

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: `Product ${status} successfully.`,
      });

      onRefresh?.();
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${status} product:`, error);
      toast({
        title: "Error",
        description: `Failed to ${status} product. Please try again.`,
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
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="rounded-lg overflow-hidden bg-muted">
            <ImageShowCase shots={product.images} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="flex items-center gap-2">
                {product.featured && (
                  <Badge variant="outline" className="text-yellow-600">
                    <Star className="mr-1 h-3 w-3" />
                    Featured
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={cn(
                    product.status === "approved" &&
                      "bg-green-100 text-green-600",
                    product.status === "pending" &&
                      "bg-yellow-100 text-yellow-600",
                    product.status === "rejected" && "bg-red-100 text-red-600"
                  )}
                >
                  {product.status}
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="grid gap-4 text-sm">
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Category</span>
              <span>{product.category}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Price</span>
              <span className="font-semibold">
                $
                {typeof product.price === "number"
                  ? product.price.toFixed(2)
                  : product.price}
              </span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Vendor</span>
              <span>{product.vendor.name}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Vendor Email</span>
              <span className="text-blue-600">{product.vendor.email}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Created Date</span>
              <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Featured</span>
              <span>{product.featured ? "Yes" : "No"}</span>
            </div>
          </div>

          {product.status === "pending" && (
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
