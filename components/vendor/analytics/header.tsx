"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AnalyticsHeader() {
  const handleExport = (type: string) => {
    // Implementation for export
    console.log(`Exporting ${type} report...`);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Analytics & Reports
        </h1>
        <p className="text-muted-foreground">
          Monitor your business performance and growth
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <DatePickerWithRange />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("sales")}>
              Sales Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("products")}>
              Product Performance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("customers")}>
              Customer Analytics
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
