"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Search,
  Filter,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductMenu, getProductByCategorySub } from "@/actions/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import type { MenuData } from "@/types/menu";
import type { Product, FilterParams } from "@/types/product";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { ContainedFilterSidebar } from "./ContainedFilterSidebar";

// API Base URL Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.sserves.com/api/v1";

const ITEMS_PER_PAGE = 16;

const sortOptions = {
  "Most Relevant": "most_recent",
  "Price: low to high": "low_to_high",
  "Price: high to low": "high_to_low",
  Newest: "newest",
} as const;

// Debounce function
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export default function ProductPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMenuLoading, setIsMenuLoading] = React.useState(true);
  const [menuData, setMenuData] = React.useState<MenuData | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [sortOption, setSortOption] =
    React.useState<keyof typeof sortOptions>("Most Relevant");
  const [filters, setFilters] = React.useState<FilterParams>({
    region_id: undefined,
    product_category: undefined,
    product_subcategory: undefined,
    min_price: undefined,
    max_price: undefined,
    min_shipping_cost: undefined,
    max_shipping_cost: undefined,
    search: undefined,
    page: undefined,
    limit: undefined,
    sort_by: undefined,
  });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Handle search with backend API (debounced)
  const handleSearchQuery = useMemo(
    () =>
      debounce((query: string) => {
        setFilters((prev) => ({ ...prev, search: query }));
        setCurrentPage(1);
      }, 500),
    [setFilters, setCurrentPage]
  );

  // Fetch menu data
  const fetchMenuData = async () => {
    setIsMenuLoading(true);
    try {
      const response = await getProductMenu();
      if (response && response.ok) {
        const data = await response.json();
        setMenuData(data.data);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setIsMenuLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchProducts = useCallback(
    async (params: FilterParams) => {
      setIsLoading(true);
      try {
        // Clean the params to remove undefined values and map to backend format
        const cleanParams = Object.entries(params).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              // Map frontend filter names to backend API parameter names
              const backendKey = key === "search" ? "search" : key;
              acc[backendKey as keyof FilterParams] = value;
            }
            return acc;
          },
          {} as any
        );

        // Build the API call parameters according to the backend format
        const apiParams = {
          limit: ITEMS_PER_PAGE,
          page: currentPage,
          sort_by: sortOptions[sortOption],
          ...cleanParams,
        };

        console.log("Sending params to backend:", apiParams); // Debug log

        const response = await getProductByCategorySub(apiParams);

        if (response && response.ok) {
          const data = await response.json();
          setProducts(data.data.product_listing || []);
          setTotalPages(data.last_page || 1);
          setTotalProducts(data.total || data.data.product_listing.length || 0);
        } else {
          setProducts([]);
          setTotalPages(1);
          setTotalProducts(0);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setIsLoading(false);
      }
    },
    [sortOption, currentPage]
  );

  // Handle favorite toggle
  const handleFavoriteToggle = async (
    productId: number,
    currentFavoriteStatus: boolean
  ) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      const formData = new FormData();
      formData.append("item_type", "product");
      formData.append("item_id", productId.toString());

      const endpoint = currentFavoriteStatus
        ? `${API_BASE_URL}/general/removeFavoriteItem`
        : `${API_BASE_URL}/general/addFavoriteItem`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        // Update the product's favorite status in local state
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, is_favorite: !currentFavoriteStatus }
              : product
          )
        );

        const message = currentFavoriteStatus
          ? "Removed from favorites"
          : "Added to favorites";
        console.log(message); // You can replace with toast notification
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
    }
  };

  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    const subCategoryId = searchParams.get("subCategoryId");

    // Create clean params object
    const params: FilterParams = {
      search: filters.search,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort_by: sortOptions[sortOption],
    };

    // Add filters only if they have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params[key as keyof FilterParams] = value;
      }
    });

    // Add URL params if present
    if (categoryId) {
      params.product_category = categoryId;
    }
    if (subCategoryId) {
      params.product_subcategory = subCategoryId;
    }

    console.log("Final params being sent:", params); // Debug log
    fetchProducts(params);
  }, [currentPage, sortOption, filters, searchParams, fetchProducts]);

  const handleAddToCart = async (product: Product) => {
    await addToCart({
      product_id: product.id,
      quantity: 1,
      unit_price: product.price,
      title: product.title,
      image: product.image,
    });
  };

  const handleProductClick = (product: Product) => {
    router.push(
      `/products/${product.id}/?title=${product.title
        .replace(/\s+/g, "-")
        .toLowerCase()}`
    );
  };

  const handleFilterChange = (newFilters: FilterParams) => {
    console.log("Filter change received:", newFilters); // Debug log
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({} as FilterParams);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SkeletonLoader = () => (
    <div
      className={`grid gap-4 sm:gap-6 ${
        isFilterOpen
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="animate-pulse">
            <div className="h-40 bg-gray-200"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#502266] mb-2">
            Discover Amazing Products
          </h1>
          <p className="text-gray-600 text-lg">
            Shop from our curated collection of quality products
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products by name, description, or category..."
                className="pl-10 pr-16 focus:ring-[#502266] focus:border-[#502266]"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearchQuery(e.target.value);
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => {
                      setSearchQuery("");
                      const newFilters = { ...filters };
                      delete newFilters.search;
                      setFilters(newFilters);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  className="h-8 px-3 bg-[#502266] hover:bg-[#502266]/90"
                  onClick={handleSearch}
                >
                  <Search className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <Button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  variant="outline"
                  className="border-[#502266] flex items-center px-3 sm:px-4 bg-transparent text-black hover:text-white hover:bg-[#502266]/90 relative text-sm"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isFilterOpen ? "Hide Filters" : "Show Filters"}
                  </span>
                  <span className="sm:hidden">Filters</span>
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
                        <Badge className="ml-2 bg-[#FF7F00] text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          {activeFilterCount}
                        </Badge>
                      )
                    );
                  })()}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex items-center gap-2 px-3 sm:px-4 text-sm"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Sort by:
                </span>
                <Select
                  value={sortOption}
                  onValueChange={(value) =>
                    setSortOption(value as keyof typeof sortOptions)
                  }
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(sortOptions).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area with Filter and Products */}
        <div className="relative">
          {/* Mobile Filter Overlay */}
          {isFilterOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          <div className="flex gap-6">
            {/* Filter Sidebar - Responsive Design */}
            <div
              className={`
              transition-all duration-300 ease-in-out
              ${
                isFilterOpen ? "md:w-1/4 md:opacity-100" : "md:w-0 md:opacity-0"
              }
              md:overflow-hidden
              ${
                isFilterOpen
                  ? "fixed inset-y-0 left-0 w-80 z-50 md:sticky md:top-32 md:bottom-8 md:h-auto md:max-h-[calc(100vh-10rem)] md:w-1/4"
                  : "hidden"
              }
            `}
            >
              <div
                className={`${
                  isFilterOpen ? "block" : "hidden"
                } md:block w-full h-full md:w-80`}
              >
                <ContainedFilterSidebar
                  menuData={menuData}
                  onFilterChange={handleFilterChange}
                  currentFilters={filters}
                  isLoading={isMenuLoading}
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                />
              </div>
            </div>

            {/* Products Section - Takes remaining width */}
            <div
              className={`
                transition-all duration-300 ease-in-out w-full
                ${isFilterOpen ? "md:w-3/4" : "md:w-full"}
              `}
            >
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#502266]">
                  Available Products
                </h2>
                <Badge variant="outline" className="text-sm">
                  {totalProducts} products found
                </Badge>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <SkeletonLoader />
              ) : !products || products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search criteria or browse all products
                  </p>
                  <Button
                    onClick={handleReset}
                    className="bg-[#502266] hover:bg-[#502266]/90"
                  >
                    Browse All Products
                  </Button>
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-4 sm:gap-6 ${
                      isFilterOpen
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    }`}
                  >
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="transition-all duration-300 transform hover:-translate-y-1"
                        onMouseEnter={() => setHoveredCard(product.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <Card
                          className={`overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                            hoveredCard === product.id
                              ? "scale-105"
                              : "hover:scale-105"
                          }`}
                        >
                          <CardContent className="p-0">
                            <div className="relative">
                              <Image
                                src={
                                  product.image || "/assets/images/tailor.png"
                                }
                                alt={product.title}
                                width={400}
                                height={200}
                                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                                onClick={() => handleProductClick(product)}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                              {/* Price Badge */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Badge className="bg-[#FF7F00] text-white border-none text-xs">
                                  ${Number.parseFloat(product.price).toFixed(2)}
                                </Badge>
                              </div>

                              {/* Favorite Button */}
                              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className={`h-8 w-8 rounded-full transition-all duration-300 ${
                                    product.is_favorite
                                      ? "bg-red-500 text-white hover:bg-red-600"
                                      : "bg-white/90 text-gray-600 hover:bg-white"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFavoriteToggle(
                                      product.id,
                                      product.is_favorite || false
                                    );
                                  }}
                                >
                                  <Heart
                                    className={`h-3 w-3 transition-all duration-300 ${
                                      product.is_favorite ? "fill-current" : ""
                                    }`}
                                  />
                                </Button>
                              </div>

                              {/* Stock Badge */}
                              {product.stock_level &&
                                product.stock_level <= 5 && (
                                  <div className="absolute bottom-2 left-2">
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Only {product.stock_level} left
                                    </Badge>
                                  </div>
                                )}
                            </div>

                            <div className="bg-[#240F2E] text-white p-3 relative overflow-hidden">
                              <div className="relative z-10">
                                <h3
                                  className="text-sm font-semibold text-[#FF7F00] mb-1 line-clamp-2 group-hover:text-white transition-colors duration-300 cursor-pointer"
                                  onClick={() => handleProductClick(product)}
                                >
                                  {product.title}
                                </h3>

                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <span className="text-xs">⭐⭐⭐⭐⭐</span>
                                    <span className="text-xs ml-1">(4.5)</span>
                                  </div>
                                  {product.stock_level && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs border-white/20 text-white"
                                    >
                                      {product.stock_level} in stock
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[#FF7F00] font-semibold text-sm">
                                    $
                                    {Number.parseFloat(product.price).toFixed(
                                      2
                                    )}
                                  </span>
                                </div>

                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                  }}
                                  className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white transition-all duration-300 transform hover:scale-105 text-xs py-1 h-8"
                                >
                                  <ShoppingCart className="mr-2 h-3 w-3" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        {/* First page */}
                        {totalPages > 1 && (
                          <Button
                            variant={currentPage === 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(1)}
                          >
                            1
                          </Button>
                        )}

                        {/* Ellipsis */}
                        {currentPage > 3 && (
                          <span className="text-gray-500">...</span>
                        )}

                        {/* Current page area */}
                        {Array.from(
                          { length: Math.min(3, totalPages) },
                          (_, i) => {
                            const pageNum = Math.max(
                              2,
                              Math.min(currentPage - 1 + i, totalPages - 1)
                            );
                            if (pageNum > 1 && pageNum < totalPages) {
                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    pageNum === currentPage
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(pageNum)}
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                            return null;
                          }
                        ).filter(Boolean)}

                        {/* Ellipsis */}
                        {currentPage < totalPages - 2 && (
                          <span className="text-gray-500">...</span>
                        )}

                        {/* Last page */}
                        {totalPages > 1 && (
                          <Button
                            variant={
                              currentPage === totalPages ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
