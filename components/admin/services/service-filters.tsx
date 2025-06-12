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
import { updateFilters, getFilterValue, clearAllFilters } from "@/lib/filters";

interface ServiceFiltersProps {
  onFiltersChange: (filters: {
    category: string;
    status: string;
    search: string;
  }) => void;
}

export function ServiceFilters({ onFiltersChange }: ServiceFiltersProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(getFilterValue("search"));
  const [category, setCategory] = useState(getFilterValue("category"));
  const [status, setStatus] = useState(getFilterValue("status"));
  const { toast } = useToast();

  // Initialize filters from URL on mount
  useEffect(() => {
    onFiltersChange({
      category: getFilterValue("category"),
      status: getFilterValue("status"),
      search: getFilterValue("search"),
    });
  }, [onFiltersChange]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await getServiceCategories();
        if (error) {
          throw new Error(error);
        }
        if (data?.["Service Category"]) {
          setCategories(data["Service Category"]);
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

  const handleSearch = () => {
    const newFilters = { search: searchQuery };
    updateFilters(newFilters);
    onFiltersChange({ ...newFilters, category, status });

  };

  const handleCategoryChange = (value: string) => {
    const newValue = value === "all" ? "" : value;
    setCategory(newValue);
    updateFilters({ category: newValue });
    onFiltersChange({ category: newValue, status, search: searchQuery });
  };

  const handleStatusChange = (value: string) => {
    const newValue = value === "all" ? "" : value;
    setStatus(newValue);
    updateFilters({ status: newValue });
    onFiltersChange({ category, status: newValue, search: searchQuery });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setStatus("");
    clearAllFilters();
    onFiltersChange({ category: "", status: "", search: "" });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
      <div className="flex gap-2 flex-1 sm:max-w-[400px]">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search services..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button variant="outline" className="px-6" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div className="flex gap-4">
        <Select
          value={category || "all"}
          onValueChange={handleCategoryChange}
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

        <Select value={status || "all"} onValueChange={handleStatusChange}>
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

        <Button variant="outline" className="px-6" onClick={handleClearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
}
