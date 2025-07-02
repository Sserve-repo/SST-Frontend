import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { MenuData } from "@/types/menu";
import type { FilterParams } from "@/types/product";
import { useMemo } from "react";

interface ContainedFilterSidebarProps {
  menuData: MenuData | null;
  onFilterChange: (filters: FilterParams) => void;
  currentFilters: FilterParams;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function ContainedFilterSidebar({
  menuData,
  onFilterChange,
  currentFilters,
  isLoading,
  isOpen,
  onClose,
}: ContainedFilterSidebarProps) {
  const [filters, setFilters] = React.useState<FilterParams>(
    currentFilters || {
      product_category: undefined,
      product_subcategory: undefined,
      min_price: undefined,
      max_price: undefined,
      min_shipping_cost: undefined,
      max_shipping_cost: undefined,
    }
  );

  // Update local filters when currentFilters change
  React.useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (
    type: keyof FilterParams,
    value: string | undefined
  ) => {
    const newFilters = {
      ...filters,
      [type]: value,
    };
    setFilters(newFilters);
    // Apply filters immediately for better UX
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    console.log("Category change:", { categoryId, checked }); // Debug log

    if (checked) {
      handleFilterChange("product_category", categoryId.toString());
      // Clear subcategory when changing main category
      const newFilters = {
        ...filters,
        product_category: categoryId.toString(),
        product_subcategory: undefined,
      };
      console.log("Setting new filters:", newFilters); // Debug log
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      const newFilters = {
        ...filters,
        product_category: undefined,
        product_subcategory: undefined,
      };
      console.log("Clearing category filters:", newFilters); // Debug log
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const handleSubcategoryChange = (itemId: number, checked: boolean) => {
    console.log("Subcategory change:", { itemId, checked }); // Debug log

    if (checked) {
      const newFilters = {
        ...filters,
        product_subcategory: itemId.toString(),
      };
      console.log("Setting subcategory filters:", newFilters); // Debug log
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      const newFilters = {
        ...filters,
        product_subcategory: undefined,
      };
      console.log("Clearing subcategory filters:", newFilters); // Debug log
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const handlePriceRangeChange = (value: string) => {
    const newFilters = { ...filters };

    switch (value) {
      case "under25":
        newFilters.min_price = "0";
        newFilters.max_price = "25";
        break;
      case "25-50":
        newFilters.min_price = "25";
        newFilters.max_price = "50";
        break;
      case "50-100":
        newFilters.min_price = "50";
        newFilters.max_price = "100";
        break;
      case "over100":
        newFilters.min_price = "100";
        newFilters.max_price = undefined;
        break;
      case "custom":
        newFilters.min_price = "";
        newFilters.max_price = "";
        break;
      default:
        newFilters.min_price = undefined;
        newFilters.max_price = undefined;
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      product_category: undefined,
      product_subcategory: undefined,
      min_price: undefined,
      max_price: undefined,
      min_shipping_cost: undefined,
      max_shipping_cost: undefined,
      search: currentFilters.search, // Keep search term
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Get unique regions
const regions = useMemo(() => {
  return menuData?.["Products Category Menu"] || [];
}, [menuData]);

  // Get unique product categories across all regions
  const allCategories = useMemo(() => {
    const categoryMap = new Map();
    regions.forEach((region) => {
      region.product_categories.forEach((category) => {
        if (!categoryMap.has(category.id)) {
          categoryMap.set(category.id, {
            ...category,
            regions: [region.name],
          });
        } else {
          const existing = categoryMap.get(category.id);
          if (!existing.regions.includes(region.name)) {
            existing.regions.push(region.name);
          }
        }
      });
    });
    return Array.from(categoryMap.values());
  }, [regions]);

  // Get subcategories for selected category
  const selectedCategorySubcategories = React.useMemo(() => {
    if (!filters.product_category) return [];
    const selectedCategory = allCategories.find(
      (cat) => cat.id.toString() === filters.product_category
    );
    return selectedCategory?.product_category_items || [];
  }, [allCategories, filters.product_category]);

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[calc(100vh)] md:h-[calc(100vh-16rem)] w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[#502266]">Filters</h2>
          {(() => {
            const activeFilterCount = Object.entries(filters).filter(
              ([key, value]) => {
                return (
                  key !== "search" &&
                  value !== undefined &&
                  value !== "" &&
                  value !== null
                );
              }
            ).length;
            return (
              activeFilterCount > 0 && (
                <Badge className="bg-[#FF7F00] text-white text-xs">
                  {activeFilterCount}
                </Badge>
              )
            );
          })()}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-gray-200 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#502266]"></div>
              </div>
            ) : (
              <>
                {/* Regions Filter */}
                {regions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 sm:mb-3 text-[#502266] border-b border-gray-200 pb-2 text-sm">
                      Regions
                    </h3>
                    <div className="space-y-1 sm:space-y-2">
                      {regions.map((region) => (
                        <div
                          key={region.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`region-${region.id}`}
                            className="data-[state=checked]:bg-[#502266] data-[state=checked]:border-[#502266]"
                          />
                          <Label
                            htmlFor={`region-${region.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {region.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Categories Filter */}
                {allCategories.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 sm:mb-3 text-[#502266] border-b border-gray-200 pb-2 text-sm">
                      Product Categories
                    </h3>
                    <div className="space-y-1 sm:space-y-2">
                      {allCategories.map((category) => (
                        <div
                          key={category.id}
                          className="space-y-1 sm:space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={
                                filters.product_category ===
                                category.id.toString()
                              }
                              onCheckedChange={(checked) =>
                                handleCategoryChange(
                                  category.id,
                                  checked as boolean
                                )
                              }
                              className="data-[state=checked]:bg-[#502266] data-[state=checked]:border-[#502266]"
                            />
                            <Label
                              htmlFor={`category-${category.id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {category.name}
                            </Label>
                          </div>
                          {category.regions.length > 1 && (
                            <div className="ml-6 text-xs text-gray-500">
                              Available in: {category.regions.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subcategories Filter */}
                {selectedCategorySubcategories.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 sm:mb-3 text-[#502266] border-b border-gray-200 pb-2 text-sm">
                      Subcategories
                    </h3>
                    <div className="space-y-1 sm:space-y-2">
                      {selectedCategorySubcategories.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`subcategory-${item.id}`}
                            checked={
                              filters.product_subcategory === item.id.toString()
                            }
                            onCheckedChange={(checked) =>
                              handleSubcategoryChange(
                                item.id,
                                checked as boolean
                              )
                            }
                            className="data-[state=checked]:bg-[#502266] data-[state=checked]:border-[#502266]"
                          />
                          <Label
                            htmlFor={`subcategory-${item.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {item.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold mb-2 sm:mb-3 text-[#502266] border-b border-gray-200 pb-2 text-sm">
                    Price Range ($)
                  </h3>
                  <RadioGroup
                    value={
                      filters.min_price === "" || filters.max_price === ""
                        ? "custom"
                        : filters.min_price && filters.max_price
                        ? `${filters.min_price}-${filters.max_price}`
                        : "any"
                    }
                    onValueChange={handlePriceRangeChange}
                    className="space-y-1 sm:space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="any"
                        id="any"
                        className="border-[#502266] text-[#502266]"
                      />
                      <Label htmlFor="any" className="text-sm cursor-pointer">
                        Any Price
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="under25"
                        id="under25"
                        className="border-[#502266] text-[#502266]"
                      />
                      <Label
                        htmlFor="under25"
                        className="text-sm cursor-pointer"
                      >
                        Under $25
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="25-50"
                        id="25-50"
                        className="border-[#502266] text-[#502266]"
                      />
                      <Label htmlFor="25-50" className="text-sm cursor-pointer">
                        $25 - $50
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="50-100"
                        id="50-100"
                        className="border-[#502266] text-[#502266]"
                      />
                      <Label
                        htmlFor="50-100"
                        className="text-sm cursor-pointer"
                      >
                        $50 - $100
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="over100"
                        id="over100"
                        className="border-[#502266] text-[#502266]"
                      />
                      <Label
                        htmlFor="over100"
                        className="text-sm cursor-pointer"
                      >
                        Over $100
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="custom"
                        id="custom"
                        className="border-[#502266] text-[#502266]"
                      />
                      <Label
                        htmlFor="custom"
                        className="text-sm cursor-pointer"
                      >
                        Custom Range:
                      </Label>
                    </div>
                  </RadioGroup>

                  {(filters.min_price === "" || filters.max_price === "") && (
                    <div className="flex items-center space-x-2 mt-2 sm:mt-3">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.min_price}
                        onChange={(e) =>
                          handleFilterChange("min_price", e.target.value)
                        }
                        className="w-16 sm:w-20 h-8 text-sm focus:ring-[#502266] focus:border-[#502266]"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.max_price}
                        onChange={(e) =>
                          handleFilterChange("max_price", e.target.value)
                        }
                        className="w-16 sm:w-20 h-8 text-sm focus:ring-[#502266] focus:border-[#502266]"
                      />
                    </div>
                  )}
                </div>

                {/* Shipping Cost Filter */}
                <div>
                  <h3 className="font-semibold mb-2 sm:mb-3 text-[#502266] border-b border-gray-200 pb-2 text-sm">
                    Shipping Cost ($)
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.min_shipping_cost}
                      onChange={(e) =>
                        handleFilterChange("min_shipping_cost", e.target.value)
                      }
                      className="w-16 sm:w-20 h-8 text-sm focus:ring-[#502266] focus:border-[#502266]"
                    />
                    <span className="text-sm text-gray-500">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.max_shipping_cost}
                      onChange={(e) =>
                        handleFilterChange("max_shipping_cost", e.target.value)
                      }
                      className="w-16 sm:w-20 h-8 text-sm focus:ring-[#502266] focus:border-[#502266]"
                    />
                  </div>
                </div>
                <h3 className="d mb-3 text-[#502266] border-b border-gray-200 pb-2 text-sm">
                  Shipping Cost ($)
                </h3>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.min_shipping_cost}
                    onChange={(e) =>
                      handleFilterChange("min_shipping_cost", e.target.value)
                    }
                    className="w-20 h-8 text-sm focus:ring-[#502266] focus:border-[#502266]"
                  />
                  <span className="text-sm text-gray-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.max_shipping_cost}
                    onChange={(e) =>
                      handleFilterChange("max_shipping_cost", e.target.value)
                    }
                    className="w-20 h-8 text-sm focus:ring-[#502266] focus:border-[#502266]"
                  />
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer Actions */}
      <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex-shrink-0">
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-full text-sm h-9 border-[#502266] text-[#502266] hover:bg-[#502266] hover:text-white"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
