"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounced-search";

interface PayoutFiltersProps {
  onFiltersChange: (filters: { search: string; type: string }) => void;
  initialFilters: {
    search: string;
    status: string;
  };
  onClearFilters?: () => void;
}

export function PayoutFilters({
  onFiltersChange,
  initialFilters,
  // onClearFilters,
}: PayoutFiltersProps) {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [type, setType] = useState(initialFilters.status || "");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setSearch(initialFilters.search || "");
    setType(initialFilters.status || "");
  }, [initialFilters]);

  useEffect(() => {
    onFiltersChange({ search: debouncedSearch, type });
  }, [debouncedSearch, type, onFiltersChange]);

  // const resetFilters = () => {
  //   setSearch("");
  //   setType("");
  //   onClearFilters?.();
  // };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-1 gap-2 sm:max-w-[400px]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by vendor/artisan name..."
          className="flex-1"
        />
      </div>

      {/* <div className="flex items-center gap-4">
        <Select
          value={type || "all"}
          onValueChange={(value) => setType(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="service">Service</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="px-6 bg-transparent"
          onClick={resetFilters}
        >
          Clear
        </Button>
      </div> */}
    </div>
  );
}
