"use client";

import { Download, Filter, Printer, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { BulkLabelDialog } from "./bulk-label-dialog";
import { useState } from "react";

export function ShippingHeader() {
  const [showBulkLabel, setShowBulkLabel] = useState(false);

  const handleExport = () => {
    // Implementation for CSV export
    console.log("Exporting shipping data...");
  };

  const handleImport = () => {
    // Implementation for CSV import
    console.log("Importing shipping data...");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl text-primary font-bold tracking-tight">
          Shipping & Fulfillment
        </h1>
        <p className="text-muted-foreground">
          Manage shipments and track deliveries
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <DatePickerWithRange />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Bulk Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowBulkLabel(true)}>
              <Printer className="mr-2 h-4 w-4" />
              Generate Labels
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              Import Tracking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <BulkLabelDialog open={showBulkLabel} onOpenChange={setShowBulkLabel} />
    </div>
  );
}
