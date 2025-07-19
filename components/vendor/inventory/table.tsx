"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditProductDialog } from "./edit-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { ProductPreviewDialog } from "./product-preview-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProductReviewsPage from "@/components/reviews/product-reviews-page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  title?: string;
  sku: string;
  category: string;
  subCategory: string;
  category_id?: string | number;
  sub_category_id?: string | number;
  price: number;
  stock: number;
  stock_level?: number;
  threshold: number;
  status: "draft" | "published" | string | number;
  lastUpdated: string;
  updated_at?: string;
  description: string;
  images: string[];
  product_images: string[];
  shippingCost: number;
  shipping_cost?: number;
}

interface InventoryTableProps {
  inventoryItems: Product[];
  onUpdate: () => void;
}

export function InventoryTable({
  inventoryItems,
  onUpdate,
}: InventoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        const imageUrl =
          product.images?.[0] ||
          product.product_images?.[0] ||
          "/placeholder.svg?height=40&width=40";

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={imageUrl || "/placeholder.svg"}
                alt={product.name || product.title}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=40&width=40";
                }}
              />
              <AvatarFallback>
                {(product.name || product.title || "P")
                  .substring(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{product.name || product.title}</div>
              <div className="text-sm text-muted-foreground">{product.sku}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.category}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.subCategory}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = Number(row.getValue("price")) || 0;
        const stock = row.original.stock || row.original.stock_level || 0;
        return (
          <div className="space-y-1">
            <div className="font-medium">${price.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">
              {stock} in stock
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const isPublished = status === "published" || status === 1;
        return (
          <Badge
            variant={isPublished ? "default" : "secondary"}
            className="capitalize"
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "reviews",
      header: "Reviews",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProduct(row.original)}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            View
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewProduct(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeletingProduct(product)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: inventoryItems || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search products..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={
            (table.getColumn("status")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("status")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} product(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {editingProduct && (
        <EditProductDialog
          productId={editingProduct.id.toString()}
          open={true}
          onOpenChange={() => setEditingProduct(null)}
          onUpdate={onUpdate}
        />
      )}
      {deletingProduct && (
        <DeleteProductDialog
          product={deletingProduct}
          open={true}
          onOpenChange={() => setDeletingProduct(null)}
          onDelete={onUpdate}
        />
      )}
      {previewProduct && (
        <ProductPreviewDialog
          product={previewProduct}
          open={true}
          onOpenChange={() => setPreviewProduct(null)}
        />
      )}

      {/* Reviews Dialog */}
      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                Product Reviews -{" "}
                {selectedProduct.name || selectedProduct.title}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <ProductReviewsPage product={selectedProduct} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
