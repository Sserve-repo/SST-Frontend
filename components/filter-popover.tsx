import * as React from "react";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { MenuData } from "@/types/menu";
import type { FilterParams } from "@/types/product";

interface FilterPopoverProps {
  menuData: MenuData | null;
  onFilterChange: (filters: FilterParams) => void;
  currentFilters: FilterParams;
  isLoading: boolean;
}

export function FilterPopover({
  menuData,
  onFilterChange,
  currentFilters,
  isLoading,
}: FilterPopoverProps) {
  const [open, setOpen] = React.useState(false);
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

  const handleFilterChange = (
    type: keyof FilterParams,
    value: string | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleCategoryChange = (
    categoryId: number,
    itemId: number,
    checked: boolean
  ) => {
    if (checked) {
      handleFilterChange("product_category", categoryId.toString());
      handleFilterChange("product_subcategory", itemId.toString());
    } else {
      handleFilterChange("product_category", undefined);
      handleFilterChange("product_subcategory", undefined);
    }
  };

  const handlePriceRangeChange = (value: string) => {
    switch (value) {
      case "under25":
        handleFilterChange("min_price", "0");
        handleFilterChange("max_price", "25");
        break;
      case "25-50":
        handleFilterChange("min_price", "25");
        handleFilterChange("max_price", "50");
        break;
      case "50-100":
        handleFilterChange("min_price", "50");
        handleFilterChange("max_price", "100");
        break;
      case "over100":
        handleFilterChange("min_price", "100");
        handleFilterChange("max_price", undefined);
        break;
      case "custom":
        handleFilterChange("min_price", "");
        handleFilterChange("max_price", "");
        break;
      default:
        handleFilterChange("min_price", undefined);
        handleFilterChange("max_price", undefined);
    }
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="border-[#502266] flex items-center px-4 bg-transparent text-black hover:text-white hover:bg-[#502266]/90"
        >
          <FilterIcon className="mr-2 h-4 w-4" />
          Filter All
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4">
        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Accordion type="single" collapsible className="w-full">
                {menuData?.["Products Category Menu"]?.map((region) => (
                  <AccordionItem key={region.id} value={region.name}>
                    <AccordionTrigger className="text-lg font-semibold">
                      {region.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      {region.product_categories.map((category) => (
                        <div key={category.id} className="mb-4">
                          <h4 className="font-medium mb-2">{category.name}</h4>
                          <div className="space-y-2 pl-4">
                            {category.product_category_items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${category.id}-${item.id}`}
                                  checked={
                                    filters.product_category ===
                                      category.id.toString() &&
                                    filters.product_subcategory ===
                                      item.id.toString()
                                  }
                                  onCheckedChange={(checked) =>
                                    handleCategoryChange(
                                      category.id,
                                      item.id,
                                      checked as boolean
                                    )
                                  }
                                />
                                <Label htmlFor={`${category.id}-${item.id}`}>
                                  {item.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mb-6 mt-4">
                <h3 className="font-semibold mb-2 text-lg">Price Range ($)</h3>
                <RadioGroup
                  value={
                    filters.min_price === "" || filters.max_price === ""
                      ? "custom"
                      : filters.min_price && filters.max_price
                      ? `${filters.min_price}-${filters.max_price}`
                      : "any"
                  }
                  onValueChange={handlePriceRangeChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">Any Price</Label>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <RadioGroupItem value="under25" id="under25" />
                    <Label htmlFor="under25">Under USD 25</Label>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25-50" id="25-50" />
                    <Label htmlFor="25-50">USD 25 - USD 50</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="50-100" id="50-100" />
                    <Label htmlFor="50-100">USD 50 - USD 100</Label>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <RadioGroupItem value="over100" id="over100" />
                    <Label htmlFor="over100">Over USD 100</Label>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom:</Label>
                  </div>
                </RadioGroup>
                {filters.min_price === "" && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.min_price}
                      onChange={(e) =>
                        handleFilterChange("min_price", e.target.value)
                      }
                      className="w-24"
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.max_price}
                      onChange={(e) =>
                        handleFilterChange("max_price", e.target.value)
                      }
                      className="w-24"
                    />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-lg">
                  Shipping Cost Range:
                </h3>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.min_shipping_cost}
                    onChange={(e) =>
                      handleFilterChange("min_shipping_cost", e.target.value)
                    }
                    className="w-24"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.max_shipping_cost}
                    onChange={(e) =>
                      handleFilterChange("max_shipping_cost", e.target.value)
                    }
                    className="w-24"
                  />
                </div>
              </div>
            </>
          )}
        </ScrollArea>

        <div className="flex justify-end mt-4 pt-2 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
