"use client";

import { useState } from "react";
import { Download, Upload, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddProductDialog } from "./add-product-dialog";
import { ImportDialog } from "./import-dialog";

export function InventoryHeader() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const handleExport = () => {
    // Implementation for CSV export
    console.log("Exporting inventory...");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl text-primary font-bold tracking-tight">
          Inventory Management
        </h1>
        <p className="text-muted-foreground">
          Manage your products and stock levels
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowAddProduct(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowImport(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import Products
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Products
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <AddProductDialog
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
      />
      <ImportDialog open={showImport} onOpenChange={setShowImport} />
    </div>
  );
}
