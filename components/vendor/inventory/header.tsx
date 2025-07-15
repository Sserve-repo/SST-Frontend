"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { AddProductDialog } from "./add-product-dialog";
import { ImportDialog } from "./import-dialog";

interface InventoryHeaderProps {
  setInventoryItems?: any;
  onRefresh: () => void;
}

export function InventoryHeader({ onRefresh }: InventoryHeaderProps) {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 500); // Small delay for UX
  };

  // const handleExport = () => {
  //   // TODO: Implement export functionality
  //   console.log("Export inventory");
  // };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button
            onClick={() => setImportDialogOpen(true)}
            variant="outline"
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button> */}

          <Button
            onClick={() => setAddProductOpen(true)}
            className="bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        onSuccess={onRefresh}
      />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={onRefresh}
      />
    </>
  );
}
