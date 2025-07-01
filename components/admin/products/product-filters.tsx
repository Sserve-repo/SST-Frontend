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
import { useDebounce } from "@/hooks/use-debounced-search";
import { getProductCategories } from "@/actions/admin/categories";
import type { ProductCategory } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";

interface Filters {
  category: string;
  status: string;
  search: string;
}

interface ProductFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  initialFilters: Filters;
  categories?: string[];
  onClearFilters?: () => void;
}

export function ProductFilters({
  onFiltersChange,
  initialFilters,
  onClearFilters,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState(initialFilters.category || "");
  const [status, setStatus] = useState(initialFilters.status || "");
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");

  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getProductCategories();

        console.log("Fetched categories:", data);
        if (error) throw new Error(error);
        if (data?.["Products Category"]) {
          setCategories(data["Products Category"]);
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load product categories.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    onFiltersChange({ category, status, search: debouncedSearchQuery });
  }, [category, status, debouncedSearchQuery, onFiltersChange]);

  useEffect(() => {
    setCategory(initialFilters.category || "");
    setStatus(initialFilters.status || "");
    setSearchQuery(initialFilters.search || "");
  }, [initialFilters]);

  const handleClearFilters = () => {
    setCategory("");
    setStatus("");
    setSearchQuery("");
    onClearFilters?.();
  };

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center justify-between">
      <div className="flex gap-2 flex-1 sm:max-w-[400px]">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1"
        />
      </div>

      <div className="flex gap-4">
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
              <SelectItem key={cat.id} value={cat.id.toString()}>
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

        <Button variant="outline" onClick={handleClearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
}
