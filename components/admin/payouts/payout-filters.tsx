"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface PayoutFiltersProps {
  onFiltersChange: (filters: { search: string; type: string }) => void;
  initialFilters: { search?: string; type?: string };
  onClearFilters: () => void;
}

export function PayoutFilters({
  onFiltersChange,
  initialFilters,
  onClearFilters,
}: PayoutFiltersProps) {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [type, setType] = useState(initialFilters.type || "");

  useEffect(() => {
    onFiltersChange({ search, type });
  }, [search, type, onFiltersChange]);

  const handleClearFilters = () => {
    setSearch("");
    setType("");
    onClearFilters();
  };

  const hasActiveFilters = search || type;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by user name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="product">Product</SelectItem>
          <SelectItem value="service">Service</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="flex items-center gap-2 bg-transparent"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
