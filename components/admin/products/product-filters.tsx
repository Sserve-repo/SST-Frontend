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
import { SearchWithSuggestions } from "@/components/ui/search-with-suggestions";
import { useDebounceSearch } from "@/hooks/use-debounced-search";
import { getProductCategories } from "@/actions/admin/categories";
import type { ProductCategory } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    category: string;
    status: string;
    search: string;
  }) => void;
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  });

  const { toast } = useToast();

  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    isLoading: searchLoading,
    fetchSuggestions,
  } = useDebounceSearch({
    // onSearch: (query) => {
    //   const newFilters = { ...filters, search: query };
    //   setFilters(newFilters);
    //   onFiltersChange(newFilters);
    // },
    onSearch: (query) => {
      if (filters.search !== query) {
        const newFilters = { ...filters, search: query };
        setFilters(newFilters);
        onFiltersChange(newFilters);
      }
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await getProductCategories();
        if (error) {
          throw new Error(error);
        }
        if (data?.data?.["Products Category"]) {
          // Remove duplicates by name
          const uniqueCategories = data.data["Products Category"].reduce(
            (acc, category) => {
              if (!acc.find((c) => c.name === category.name)) {
                acc.push(category);
              }
              return acc;
            },
            [] as ProductCategory[]
          );
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: "", status: "", search: "" };
    setFilters(clearedFilters);
    setSearchQuery("");
    onFiltersChange(clearedFilters);
  };

  useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    }
  }, [searchQuery, fetchSuggestions]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <SearchWithSuggestions
        value={searchQuery}
        onChange={setSearchQuery}
        suggestions={suggestions}
        isLoading={searchLoading}
        placeholder="Search products..."
        className="flex-1 sm:max-w-[300px]"
      />

      <div className="flex gap-4">
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={loading ? "Loading..." : "Category"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
}
