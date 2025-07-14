"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/actions/product";
import type { Product } from "@/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MetricsCards } from "@/components/dashboard/products/metrics-cards";
import { ProductTable } from "@/components/dashboard/products/product-table";
import { ProductForm } from "@/components/dashboard/products/product-form";
import { ProductFormData } from "@/types/product";
import { ProductsLoading } from "@/components/dashboard/loading";

export default function ProductsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowAddModal(false);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; data: ProductFormData }) =>
      updateProduct(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowDeleteDialog(false);
      setDeletingProduct(null);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const handleCreate = async (data: ProductFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdate = async (data: ProductFormData) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    }
  };

  const handleDelete = async () => {
    if (deletingProduct) {
      deleteMutation.mutate(deletingProduct.id);
    }
  };

  if (isLoading) {
    return <ProductsLoading />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">Your Inventory</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-4 md:gap-6">
        <MetricsCards
          totalProducts={data.totalProducts}
          activeProducts={data.activeProducts}
          outOfStock={data.outOfStock}
          totalStockValue={data.totalStockValue}
          newProducts={data.newProducts}
          outOfStockPercentage={data.outOfStockPercentage}
        />

        <div className="overflow-x-auto">
          <ProductTable
            products={data.products as any}
            onEdit={setEditingProduct}
            onDelete={(product) => {
              setDeletingProduct(product);
              setShowDeleteDialog(true);
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Showing 0-13 of 13</p>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              &lt;
            </Button>
            <Button variant="outline" size="icon">
              &gt;
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={showAddModal || !!editingProduct}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddModal(false);
            setEditingProduct(null);
          }
        }}
      >
        <DialogContent className=" max-w-2xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <ProductForm
              initialData={editingProduct || undefined}
              onSubmit={editingProduct ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowAddModal(false);
                setEditingProduct(null);
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setDeletingProduct(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
