"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  Eye,
  MoreHorizontal,
  Star,
  X,
  Loader2,
  Ban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ProductDetailsDialog } from "./product-details-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { updateProductStatus } from "@/actions/admin/product-api";

interface ProductTableProps {
  products: IProduct[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    total: number;
    perPage: number;
  };
  onPageChange?: (page: number) => void;
}

export function ProductTable({
  products,
  selectedIds,
  onSelectedIdsChange,
  onRefresh,
  isLoading = false,
  pagination,
  onPageChange,
}: ProductTableProps) {
  const [productToView, setProductToView] = useState<IProduct | null>(null);
  const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);
  const [productToDelete, setProductToDisabled] = useState<IProduct | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { toast } = useToast();

  const toggleAll = () => {
    if (selectedIds.length === products.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(products.map((product) => product.id!));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter((productId) => productId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  const handleSingleAction = async (
    productId: string,
    action: "approve" | "reject" | "disable" | "feature",
    currentStatus?: boolean
  ) => {
    setActionLoading(`${action}-${productId}`);

    try {
      if (action === "approve" || action === "reject") {
        const { error } = await updateProductStatus({
          status: action === "approve" ? "approved" : "rejected",
          product_ids: [Number.parseInt(productId)],
        });

        if (error) {
          throw new Error(error);
        }

        toast({
          title: "Success",
          description: `Product ${action}d successfully.`,
        });
      } else if (action === "disable") {
        const { error } = await updateProductStatus({
          status: "disabled",
          product_ids: [Number.parseInt(productId)],
        });

        if (error) {
          throw new Error(error);
        }

        toast({
          title: "Success",
          description: "Product disabled successfully.",
        });
      } else if (action === "feature") {
        // Feature/unfeature logic would go here
        toast({
          title: "Success",
          description: `Product ${
            currentStatus ? "unfeatured" : "featured"
          } successfully.`,
        });
      }

      onRefresh?.();
    } catch (error) {
      console.error(`Failed to ${action} product:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} product. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedIds.length === products.length &&
                    products.length > 0
                  }
                  onCheckedChange={toggleAll}
                  disabled={isLoading}
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className={isLoading ? "opacity-50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(product.id!)}
                      onCheckedChange={() => toggleOne(product.id!)}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          typeof product.images[0] === "string"
                            ? product.images[0]
                            : "/assets/images/image-placeholder.png?height=40&width=40"
                        }
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (
                            !target.src.includes(
                              "/assets/images/image-placeholder.png"
                            )
                          ) {
                            target.src =
                              "/assets/images/image-placeholder.png?height=40&width=40";
                          }
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    $
                    {typeof product.price === "number"
                      ? product.price.toFixed(2)
                      : product.price}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.vendor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.vendor.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        product.status === "approved" &&
                          "bg-green-100 text-green-600",
                        product.status === "pending" &&
                          "bg-yellow-100 text-yellow-600",
                        product.status === "rejected" &&
                          "bg-red-100 text-red-600",
                        product.status === "disabled" &&
                          "bg-gray-100 text-gray-600"
                      )}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleSingleAction(
                          product.id!,
                          "feature",
                          product.featured
                        )
                      }
                      disabled={actionLoading === `feature-${product.id}`}
                    >
                      {actionLoading === `feature-${product.id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Star
                          className={cn(
                            "h-4 w-4",
                            product.featured
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-400"
                          )}
                        />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLoading}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setProductToView(product)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                          onClick={() => setProductToEdit(product)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem> */}
                        {product.status === "pending" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleSingleAction(product.id!, "reject")
                              }
                              disabled={
                                actionLoading === `reject-${product.id}`
                              }
                            >
                              {actionLoading === `reject-${product.id}` ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <X className="mr-2 h-4 w-4 text-red-600" />
                              )}
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleSingleAction(product.id!, "approve")
                              }
                              disabled={
                                actionLoading === `approve-${product.id}`
                              }
                            >
                              {actionLoading === `approve-${product.id}` ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                              )}
                              Approve
                            </DropdownMenuItem>
                          </>
                        )}
                        {product.status === "rejected" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleSingleAction(product.id!, "approve")
                            }
                            disabled={actionLoading === `approve-${product.id}`}
                          >
                            {actionLoading === `approve-${product.id}` ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                            )}
                            Approve
                          </DropdownMenuItem>
                        )}
                        {product.status === "approved" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleSingleAction(product.id!, "reject")
                            }
                            disabled={actionLoading === `reject-${product.id}`}
                          >
                            {actionLoading === `reject-${product.id}` ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <X className="mr-2 h-4 w-4 text-red-600" />
                            )}
                            Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleSingleAction(product.id!, "disable")
                          }
                          disabled={actionLoading === `disable-${product.id}`}
                          className="text-red-600"
                        >
                          {actionLoading === `disable-${product.id}` ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Ban className="mr-2 h-4 w-4" />
                          )}
                          Disable
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {(pagination.currentPage - 1) * pagination.perPage + 1} to{" "}
            {Math.min(
              pagination.currentPage * pagination.perPage,
              pagination.total
            )}{" "}
            of {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              <span className="text-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      <ProductDetailsDialog
        product={productToView}
        onOpenChange={(open) => !open && setProductToView(null)}
        onRefresh={onRefresh}
      />

      <EditProductDialog
        product={productToEdit}
        onOpenChange={(open) => !open && setProductToEdit(null)}
        onRefresh={onRefresh}
      />

      <DeleteProductDialog
        product={productToDelete}
        onOpenChange={(open) => !open && setProductToDisabled(null)}
        onRefresh={onRefresh}
      />
    </>
  );
}
