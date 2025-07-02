"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getServiceCategories } from "@/actions/admin/categories";
import type { ServiceCategory } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounced-search";

interface ServiceFiltersProps {
  onFiltersChange: (filters: {
    category: string;
    status: string;
    search: string;
  }) => void;
  initialFilters: {
    category: string;
    status: string;
    search: string;
  };
  onClearFilters?: () => void;
}

export function ServiceFilters({
  onFiltersChange,
  initialFilters,
  onClearFilters,
}: ServiceFiltersProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState(initialFilters.search || "");
  const [category, setCategory] = useState(initialFilters.category || "");
  const [status, setStatus] = useState(initialFilters.status || "");

  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setSearch(initialFilters.search || "");
    setCategory(initialFilters.category || "");
    setStatus(initialFilters.status || "");
  }, [initialFilters]);

  useEffect(() => {
    onFiltersChange({ category, status, search: debouncedSearch });
  }, [category, status, debouncedSearch, onFiltersChange]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getServiceCategories();
        if (error) throw new Error(error);
        if (data?.["Service Category"]) {
          setCategories(data["Service Category"]);
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load service categories.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    onClearFilters?.();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-1 gap-2 sm:max-w-[400px]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="flex-1"
        />
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={category || "all"}
          onValueChange={(value) => setCategory(value === "all" ? "" : value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={isLoading ? "Loading..." : "Category"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()} className="capitalize line-clamp-1">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status || "all"}
          onValueChange={(value) => setStatus(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="px-6 bg-transparent"
          onClick={resetFilters}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
