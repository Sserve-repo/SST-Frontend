"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  Search,
  Package,
  Wrench,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";

type Product = {
  id: number;
  title: string;
  image?: string;
  price: string | number;
  stock_level?: number;
  description?: string;
  created_at?: string;
  [key: string]: any;
};

type Service = {
  id: number;
  title: string;
  image?: string;
  price: string | number;
  description?: string;
  created_at?: string;
  [key: string]: any;
};

// API Base URL Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.sserves.com/api/v1";

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recent");
  const { isAuthenticated } = useAuth();
  const itemsPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Fetch favorites from API with search
  const fetchFavorites = useCallback(
    async (search = "") => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        const token = Cookies.get("accessToken");
        const url = search
          ? `${API_BASE_URL}/general/fetchFavoriteItem?search=${encodeURIComponent(
              search
            )}`
          : `${API_BASE_URL}/general/fetchFavoriteItem`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status && data.data) {
            setProducts(data.data.products || []);
            setServices(data.data.services || []);
          } else {
            throw new Error(data.message || "Failed to fetch favorites");
          }
        } else {
          throw new Error(`Failed to fetch favorites (${response.status})`);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Unable to load your favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Remove from favorites
  const removeFromFavorites = async (itemId, itemType) => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("item_type", itemType);
      formData.append("item_id", itemId.toString());

      const response = await fetch(
        `${API_BASE_URL}/general/removeFavoriteItem`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.status) {
        // Remove from local state
        if (itemType === "product") {
          setProducts((prev) => prev.filter((item) => item.id !== itemId));
        } else {
          setServices((prev) => prev.filter((item) => item.id !== itemId));
        }

        // Show success message
        alert("Removed from favorites");
      } else {
        throw new Error(data.message || "Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Unable to remove from favorites. Please try again.");
    }
  };

  // Filtering and sorting logic
  const filterAndSortItems = (items, type) => {
    console.log(type);
    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort items
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // recent
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return filtered;
  };

  // Handle search with backend API
  const handleSearch = useCallback(
    debounce((query: string) => {
      fetchFavorites(query);
    }, 500),
    [fetchFavorites]
  );

  // Debounce function
  function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  const filteredProducts = filterAndSortItems(products, "product");
  const filteredServices = filterAndSortItems(services, "service");
  const allItems = [...filteredProducts, ...filteredServices];

  // Pagination logic
  const getCurrentItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (items) => Math.ceil(items.length / itemsPerPage);

  const getItemsToShow = () => {
    switch (activeTab) {
      case "products":
        return getCurrentItems(filteredProducts);
      case "services":
        return getCurrentItems(filteredServices);
      default:
        return getCurrentItems(allItems);
    }
  };

  const getCurrentTotalPages = () => {
    switch (activeTab) {
      case "products":
        return getTotalPages(filteredProducts);
      case "services":
        return getTotalPages(filteredServices);
      default:
        return getTotalPages(allItems);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Handle search input changes
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  // Reset page when changing tabs or sorting
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortBy]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#502266] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#502266] mb-2">
                My Favorites
              </h1>
              <p className="text-gray-600">
                {products.length + services.length} items saved for later
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 md:w-auto w-full">
              <div className="relative flex-1 md:w-80">
                <Input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-20 focus:ring-[#502266] focus:border-[#502266]"
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="h-8 px-3 bg-[#502266] hover:bg-[#502266]/90"
                    onClick={() => handleSearch(searchQuery)}
                  >
                    <Search className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low-High)</SelectItem>
                  <SelectItem value="price-high">Price (High-Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
            <Button
              onClick={() => fetchFavorites()}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 h-12">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 data-[state=active]:bg-[#502266] data-[state=active]:text-white"
            >
              <Filter className="h-4 w-4" />
              All ({allItems.length})
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 data-[state=active]:bg-[#FF7F00] data-[state=active]:text-white"
            >
              <Package className="h-4 w-4" />
              Products ({filteredProducts.length})
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="flex items-center gap-2 data-[state=active]:bg-[#502266] data-[state=active]:text-white"
            >
              <Wrench className="h-4 w-4" />
              Services ({filteredServices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <FavoritesGrid
              items={getItemsToShow()}
              removeFromFavorites={removeFromFavorites}
              mixed={true}
              type={undefined}
            />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <FavoritesGrid
              items={getCurrentItems(filteredProducts)}
              removeFromFavorites={removeFromFavorites}
              type="product"
            />
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <FavoritesGrid
              items={getCurrentItems(filteredServices)}
              removeFromFavorites={removeFromFavorites}
              type="service"
            />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {getCurrentTotalPages() > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {getCurrentTotalPages()}
            </span>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(getCurrentTotalPages(), prev + 1)
                )
              }
              disabled={currentPage === getCurrentTotalPages()}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Favorites Grid Component
function FavoritesGrid({ items, removeFromFavorites, type, mixed = false }) {
  const router = useRouter();

  const handleItemClick = (item) => {
    const itemType = item.stock_level !== undefined ? "product" : "service";
    if (itemType === "product") {
      router.push(`/products/${item.id}`);
    } else {
      router.push(`/services/${item.id}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No favorites found
        </h3>
        <p className="text-gray-500 mb-6">
          {mixed
            ? "You haven't added any favorites yet."
            : `No favorite ${type}s found.`}
        </p>
        <Button
          onClick={() =>
            router.push(type === "service" ? "/services" : "/products")
          }
          className="bg-[#502266] hover:bg-[#502266]/90"
        >
          Browse {type === "service" ? "Services" : "Products"}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => {
        const isProduct = item.stock_level !== undefined;

        return (
          <Card
            key={`${isProduct ? "product" : "service"}-${item.id}`}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => handleItemClick(item)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={item.image || "/assets/images/tailor.png"}
                  alt={item.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Type Badge */}
                <Badge
                  className={`absolute top-3 left-3 ${
                    isProduct ? "bg-[#FF7F00]" : "bg-[#502266]"
                  }`}
                >
                  {isProduct ? "Product" : "Service"}
                </Badge>

                {/* Remove Button */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorites(
                      item.id,
                      isProduct ? "product" : "service"
                    );
                  }}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#502266] transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description || "No description available"}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#FF7F00]">
                    ${parseFloat(item.price).toFixed(2)}
                  </span>

                  {isProduct && item.stock_level && (
                    <Badge variant="outline" className="text-xs">
                      {item.stock_level} in stock
                    </Badge>
                  )}
                </div>

                <Button
                  className={`w-full mt-4 ${
                    isProduct
                      ? "bg-[#FF7F00] hover:bg-[#FF7F00]/90"
                      : "bg-[#502266] hover:bg-[#502266]/90"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(item);
                  }}
                >
                  {isProduct ? "View Product" : "Book Service"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
