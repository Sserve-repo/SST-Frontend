"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProductPreviewDialogProps {
  product: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductPreviewDialog({
  product,
  open,
  onOpenChange,
}: ProductPreviewDialogProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <img
                src={
                  product?.images[currentImage] ||
                  product?.image ||
                  "/placeholder.svg"
                }
                alt={product.name}
                className="absolute h-full w-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={previousImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex gap-2 overflow-auto py-1">
              {Array(product?.images).map((image: string, index: number) => (
                <button
                  key={index}
                  className={cn(
                    "relative aspect-square h-16 overflow-hidden rounded-lg border",
                    currentImage === index &&
                      "ring-2 ring-primary ring-offset-2"
                  )}
                  onClick={() => setCurrentImage(index)}
                >
                  <img
                    src={image[0] || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                </div>
                <Badge
                  variant={
                    product.status === "published" ? "default" : "secondary"
                  }
                  className="capitalize"
                >
                  {product.status == 1? "Approved": "Pending"}
                </Badge>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="text-2xl font-bold">
                    {/* ${product?.price?.toFixed(2)} */}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Stock Level
                  </div>
                  <div className="font-medium">
                    {product?.stock}{" "}
                    {product?.stock <= product.threshold && (
                      <Badge variant="destructive" className="ml-2">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="font-medium">
                    {product?.category} / {product.subCategory}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Shipping Cost
                  </div>
                  <div className="font-medium">
                    ${product.shippingCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Description</div>
              <p className="mt-2">{product.description}</p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="mt-2 font-medium">{product.lastUpdated}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
