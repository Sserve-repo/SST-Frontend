// import * as React from "react";
// import { FilterIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import type { MenuData } from "@/types/menu";
// import type { FilterParams } from "@/types/product";

// interface FilterPopoverProps {
//   menuData: MenuData | null;
//   onFilterChange: (filters: FilterParams) => void;
//   currentFilters: FilterParams;
//   isLoading: boolean;
// }

// export function FilterPopover({
//   menuData,
//   onFilterChange,
//   currentFilters,
//   isLoading,
// }: FilterPopoverProps) {
//   const [open, setOpen] = React.useState(false);
//   const [filters, setFilters] = React.useState<FilterParams>(
//     currentFilters || {
//       product_category: undefined,
//       product_subcategory: undefined,
//       min_price: undefined,
//       max_price: undefined,
//       min_shipping_cost: undefined,
//       max_shipping_cost: undefined,
//     }
//   );

//   const handleFilterChange = (
//     type: keyof FilterParams,
//     value: string | undefined
//   ) => {
//     setFilters((prev) => ({
//       ...prev,
//       [type]: value,
//     }));
//   };

//   const handleCategoryChange = (
//     categoryId: number,
//     itemId: number,
//     checked: boolean
//   ) => {
//     if (checked) {
//       handleFilterChange("product_category", categoryId.toString());
//       handleFilterChange("product_subcategory", itemId.toString());
//     } else {
//       handleFilterChange("product_category", undefined);
//       handleFilterChange("product_subcategory", undefined);
//     }
//   };

//   const handlePriceRangeChange = (value: string) => {
//     switch (value) {
//       case "under25":
//         handleFilterChange("min_price", "0");
//         handleFilterChange("max_price", "25");
//         break;
//       case "25-50":
//         handleFilterChange("min_price", "25");
//         handleFilterChange("max_price", "50");
//         break;
//       case "50-100":
//         handleFilterChange("min_price", "50");
//         handleFilterChange("max_price", "100");
//         break;
//       case "over100":
//         handleFilterChange("min_price", "100");
//         handleFilterChange("max_price", undefined);
//         break;
//       case "custom":
//         handleFilterChange("min_price", "");
//         handleFilterChange("max_price", "");
//         break;
//       default:
//         handleFilterChange("min_price", undefined);
//         handleFilterChange("max_price", undefined);
//     }
//   };

//   const handleApplyFilters = () => {
//     onFilterChange(filters);
//     setOpen(false);
//   };

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           className="border-[#502266] flex items-center px-4 bg-transparent text-black hover:text-white hover:bg-[#502266]/90"
//         >
//           <FilterIcon className="mr-2 h-4 w-4" />
//           Filter All
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[400px] p-4">
//         <ScrollArea className="h-[500px] pr-4">
//           {isLoading ? (
//             <div className="flex items-center justify-center h-20">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//             </div>
//           ) : (
//             <>
//               <Accordion type="single" collapsible className="w-full">
//                 {menuData?.["Products Category Menu"]?.map((region) => (
//                   <AccordionItem key={region.id} value={region.name}>
//                     <AccordionTrigger className="text-lg font-semibold">
//                       {region.name}
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       {region.product_categories.map((category) => (
//                         <div key={category.id} className="mb-4">
//                           <h4 className="font-medium mb-2">{category.name}</h4>
//                           <div className="space-y-2 pl-4">
//                             {category.product_category_items.map((item) => (
//                               <div
//                                 key={item.id}
//                                 className="flex items-center space-x-2"
//                               >
//                                 <Checkbox
//                                   id={`${category.id}-${item.id}`}
//                                   checked={
//                                     filters.product_category ===
//                                       category.id.toString() &&
//                                     filters.product_subcategory ===
//                                       item.id.toString()
//                                   }
//                                   onCheckedChange={(checked) =>
//                                     handleCategoryChange(
//                                       category.id,
//                                       item.id,
//                                       checked as boolean
//                                     )
//                                   }
//                                 />
//                                 <Label htmlFor={`${category.id}-${item.id}`}>
//                                   {item.name}
//                                 </Label>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                     </AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </Accordion>

//               <div className="mb-6 mt-4">
//                 <h3 className="font-semibold mb-2 text-lg">Price Range ($)</h3>
//                 <RadioGroup
//                   value={
//                     filters.min_price === "" || filters.max_price === ""
//                       ? "custom"
//                       : filters.min_price && filters.max_price
//                       ? `${filters.min_price}-${filters.max_price}`
//                       : "any"
//                   }
//                   onValueChange={handlePriceRangeChange}
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="any" id="any" />
//                     <Label htmlFor="any">Any Price</Label>
//                   </div>
//                   {/* <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="under25" id="under25" />
//                     <Label htmlFor="under25">Under USD 25</Label>
//                   </div> */}
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="25-50" id="25-50" />
//                     <Label htmlFor="25-50">USD 25 - USD 50</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="50-100" id="50-100" />
//                     <Label htmlFor="50-100">USD 50 - USD 100</Label>
//                   </div>
//                   {/* <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="over100" id="over100" />
//                     <Label htmlFor="over100">Over USD 100</Label>
//                   </div> */}
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="custom" id="custom" />
//                     <Label htmlFor="custom">Custom:</Label>
//                   </div>
//                 </RadioGroup>
//                 {filters.min_price === "" && (
//                   <div className="flex items-center space-x-2 mt-2">
//                     <Input
//                       type="number"
//                       placeholder="Min"
//                       value={filters.min_price}
//                       onChange={(e) =>
//                         handleFilterChange("min_price", e.target.value)
//                       }
//                       className="w-24"
//                     />
//                     <span>to</span>
//                     <Input
//                       type="number"
//                       placeholder="Max"
//                       value={filters.max_price}
//                       onChange={(e) =>
//                         handleFilterChange("max_price", e.target.value)
//                       }
//                       className="w-24"
//                     />
//                   </div>
//                 )}
//               </div>

//               <div className="mb-6">
//                 <h3 className="font-semibold mb-2 text-lg">
//                   Shipping Cost Range:
//                 </h3>
//                 <div className="flex items-center space-x-2">
//                   <Input
//                     type="number"
//                     placeholder="Min"
//                     value={filters.min_shipping_cost}
//                     onChange={(e) =>
//                       handleFilterChange("min_shipping_cost", e.target.value)
//                     }
//                     className="w-24"
//                   />
//                   <span>to</span>
//                   <Input
//                     type="number"
//                     placeholder="Max"
//                     value={filters.max_shipping_cost}
//                     onChange={(e) =>
//                       handleFilterChange("max_shipping_cost", e.target.value)
//                     }
//                     className="w-24"
//                   />
//                 </div>
//               </div>
//             </>
//           )}
//         </ScrollArea>

//         <div className="flex justify-end mt-4 pt-2 border-t">
//           <Button
//             variant="outline"
//             onClick={() => setOpen(false)}
//             className="mr-2"
//           >
//             Cancel
//           </Button>
//           <Button onClick={handleApplyFilters}>Apply Filters</Button>
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// }

import * as React from "react";
import { FilterIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { MenuData } from "@/types/menu";
import type { FilterParams } from "@/types/product";

interface FilterSidebarProps {
  menuData: MenuData | null;
  onFilterChange: (filters: FilterParams) => void;
  currentFilters: FilterParams;
  isLoading: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterSidebar({
  menuData,
  onFilterChange,
  currentFilters,
  isLoading,
  isOpen,
  onOpenChange,
}: FilterSidebarProps) {
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
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      handleFilterChange("product_category", categoryId.toString());
      // Clear subcategory when changing main category
      handleFilterChange("product_subcategory", undefined);
    } else {
      handleFilterChange("product_category", undefined);
      handleFilterChange("product_subcategory", undefined);
    }
  };

  const handleSubcategoryChange = (itemId: number, checked: boolean) => {
    if (checked) {
      handleFilterChange("product_subcategory", itemId.toString());
    } else {
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
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      product_category: undefined,
      product_subcategory: undefined,
      min_price: undefined,
      max_price: undefined,
      min_shipping_cost: undefined,
      max_shipping_cost: undefined,
      search: undefined,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Get unique regions
  const regions = menuData?.["Products Category Menu"] || [];

  // Get unique product categories across all regions
  const allCategories = React.useMemo(() => {
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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.product_category) count++;
    if (filters.product_subcategory) count++;
    if (filters.min_price || filters.max_price) count++;
    if (filters.min_shipping_cost || filters.max_shipping_cost) count++;
    return count;
  };

  return (
    <>
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={() => onOpenChange(!isOpen)}
        className="border-[#502266] flex items-center px-4 bg-transparent text-black hover:text-white hover:bg-[#502266]/90 relative"
      >
        <FilterIcon className="mr-2 h-4 w-4" />
        Filter Products
        {getActiveFiltersCount() > 0 && (
          <Badge className="ml-2 bg-[#FF7F00] text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
            {getActiveFiltersCount()}
          </Badge>
        )}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FilterIcon className="h-5 w-5 text-[#502266]" />
            <h2 className="text-lg font-semibold text-[#502266]">
              Filter Products
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 h-full">
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#502266]"></div>
              </div>
            ) : (
              <>
                {/* Regions Filter */}
                {regions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-[#502266] border-b border-gray-200 pb-2">
                      Regions
                    </h3>
                    <div className="space-y-2">
                      {regions.map((region) => (
                        <div
                          key={region.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox id={`region-${region.id}`} />
                          <Label
                            htmlFor={`region-${region.id}`}
                            className="text-sm"
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
                    <h3 className="font-semibold mb-3 text-[#502266] border-b border-gray-200 pb-2">
                      Product Categories
                    </h3>
                    <div className="space-y-2">
                      {allCategories.map((category) => (
                        <div key={category.id} className="space-y-2">
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
                            />
                            <Label
                              htmlFor={`category-${category.id}`}
                              className="text-sm font-medium"
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
                    <h3 className="font-semibold mb-3 text-[#502266] border-b border-gray-200 pb-2">
                      Subcategories
                    </h3>
                    <div className="space-y-2">
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
                          />
                          <Label
                            htmlFor={`subcategory-${item.id}`}
                            className="text-sm"
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
                  <h3 className="font-semibold mb-3 text-[#502266] border-b border-gray-200 pb-2">
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
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any" className="text-sm">
                        Any Price
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="under25" id="under25" />
                      <Label htmlFor="under25" className="text-sm">
                        Under $25
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="25-50" id="25-50" />
                      <Label htmlFor="25-50" className="text-sm">
                        $25 - $50
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50-100" id="50-100" />
                      <Label htmlFor="50-100" className="text-sm">
                        $50 - $100
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="over100" id="over100" />
                      <Label htmlFor="over100" className="text-sm">
                        Over $100
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="text-sm">
                        Custom Range:
                      </Label>
                    </div>
                  </RadioGroup>

                  {(filters.min_price === "" || filters.max_price === "") && (
                    <div className="flex items-center space-x-2 mt-3">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.min_price}
                        onChange={(e) =>
                          handleFilterChange("min_price", e.target.value)
                        }
                        className="w-20 h-8 text-sm"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.max_price}
                        onChange={(e) =>
                          handleFilterChange("max_price", e.target.value)
                        }
                        className="w-20 h-8 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Shipping Cost Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#502266] border-b border-gray-200 pb-2">
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
                      className="w-20 h-8 text-sm"
                    />
                    <span className="text-sm text-gray-500">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.max_shipping_cost}
                      onChange={(e) =>
                        handleFilterChange("max_shipping_cost", e.target.value)
                      }
                      className="w-20 h-8 text-sm"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1 text-sm h-9"
            >
              Clear All
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-[#502266] hover:bg-[#502266]/90 text-sm h-9"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Updated FilterPopover component for backward compatibility
export function FilterPopover({
  menuData,
  onFilterChange,
  currentFilters,
  isLoading,
}: {
  menuData: MenuData | null;
  onFilterChange: (filters: FilterParams) => void;
  currentFilters: FilterParams;
  isLoading: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <FilterSidebar
      menuData={menuData}
      onFilterChange={onFilterChange}
      currentFilters={currentFilters}
      isLoading={isLoading}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    />
  );
}
