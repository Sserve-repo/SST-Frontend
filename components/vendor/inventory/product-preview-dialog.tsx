"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

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
  if (!product) return null;

  const images = product.product_images || product.images || [];
  const price = Number(product.price) || 0;
  const shippingCost =
    Number(product.shipping_cost || product.shippingCost) || 0;
  const stock = Number(product.stock_level || product.stock) || 0;
  const isPublished = product.status === 1 || product.status === "published";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Product Preview</DialogTitle>
        </DialogHeader>

        <div className="">
          <div className="space-y-6">
            {/* Product Images */}
            {images.length > 0 && (
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={images[0] || "/placeholder.svg?height=400&width=400"}
                    alt={product.name || product.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/placeholder.svg?height=400&width=400";
                    }}
                  />
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(1, 5).map((image: string, index: number) => (
                      <div
                        key={index}
                        className="aspect-square overflow-hidden rounded border bg-muted"
                      >
                        <img
                          src={image || "/placeholder.svg?height=100&width=100"}
                          alt={`${product.name || product.title} ${index + 2}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/placeholder.svg?height=100&width=100";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {product.name || product.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  SKU: {product.sku}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-green-600">
                  ${price.toFixed(2)}
                </div>
                <Badge variant={isPublished ? "default" : "secondary"}>
                  {isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Sub-category:
                      </span>
                      <span>{product.subCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Stock Level:
                      </span>
                      <span
                        className={
                          stock <= (product.threshold || 5)
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        {stock} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Low Stock Alert:
                      </span>
                      <span>{product.threshold || 5} units</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Pricing & Shipping</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Product Price:
                      </span>
                      <span className="font-medium">${price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Shipping Cost:
                      </span>
                      <span className="font-medium">
                        ${shippingCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">
                        Total (with shipping):
                      </span>
                      <span className="font-bold">
                        ${(price + shippingCost).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {product.description && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </>
            )}

            {/* Timestamps */}
            <Separator />
            <div className="text-xs text-muted-foreground">
              <div>
                Last updated:{" "}
                {new Date(
                  product.updated_at || product.lastUpdated
                ).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
