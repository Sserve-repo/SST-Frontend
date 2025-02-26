"use client";

import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductMenu, getProductByCategorySub } from "@/actions/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FilterPopover } from "@/components/filter-popover";
import type { MenuData } from "@/types/menu";
import type { Product, FilterParams } from "@/types/product";

const ITEMS_PER_PAGE = 12;

const sortOptions = {
  "Most Relevant": "most_recent",
  "Price: low to high": "low_to_high",
  "Price: high to low": "high_to_low",
  Newest: "newest",
} as const;

export default function ProductPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMenuLoading, setIsMenuLoading] = React.useState(true);
  const [menuData, setMenuData] = React.useState<MenuData | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [sortOption, setSortOption] =
    React.useState<keyof typeof sortOptions>("Most Relevant");
  const [filters, setFilters] = React.useState<FilterParams>({});

  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

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

  const fetchProducts = async (params: FilterParams) => {
    setIsLoading(true);
    try {
      const response = await getProductByCategorySub({
        limit: ITEMS_PER_PAGE,
        page: currentPage,
        sort_by: sortOptions[sortOption],
        ...params,
      });

      if (response && response.ok) {
        const data = (await response.json());
        setProducts(data.data.product_listing);
        setTotalPages(data.last_page);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    const subCategoryId = searchParams.get("subCategoryId");

    const params: FilterParams = {
      ...filters,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort_by: sortOptions[sortOption],
    };

    if (categoryId) {
      params.product_category = categoryId;
    }
    if (subCategoryId) {
      params.product_subcategory = subCategoryId;
    }

    fetchProducts(params);
  }, [currentPage, sortOption, filters, searchParams]);

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
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden animate-pulse">
          <div className="relative h-48 bg-gray-300 rounded-lg"></div>
          <CardContent className="p-4">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white justify-center flex">
      {isLoading ? (
        <div className="container mx-auto px-4 md:px-6 mt-32">
          <SkeletonLoader />
        </div>
      ) : !products || products.length === 0 ? (
        <div className="container w-full mx-auto flex justify-center items-center flex-col h-screen px-4 py-4 text-center">
          <h1 className="text-2xl font-bold mb-4">No Products Found</h1>
          <p className="mb-4">
            Looks like there are no products matching your criteria.
          </p>
          <Link href="/products">
            <Button>View All Products</Button>
          </Link>
        </div>
      ) : (
        <section className="bg-white w-full py-12 md:py-24 min-h-screen">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 mt-8">
              <FilterPopover
                menuData={menuData}
                onFilterChange={handleFilterChange}
                currentFilters={filters}
                isLoading={isMenuLoading}
              />
              <div className="flex items-center space-x-4">
                <span className="text-sm">Sort By:</span>
                <Select
                  value={sortOption}
                  onValueChange={(value) =>
                    setSortOption(value as keyof typeof sortOptions)
                  }
                >
                  <SelectTrigger className="w-48">
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

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div
                      className="relative h-48"
                      onClick={() => handleProductClick(product)}
                    >
                      <Image
                        src={product.image || "/assets/images/image-placeholder.png"}
                        alt={product.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg cursor-pointer"
                      />
                    </div>
                    <CardContent className="bg-[#FF9F3F] p-4 h-full">
                      <h3
                        className="text-lg font-semibold text-black mb-2 cursor-pointer hover:underline"
                        onClick={() => handleProductClick(product)}
                      >
                        {product.title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-white border border-white rounded-full px-3 py-1">
                          ${Number.parseFloat(product.price).toFixed(2)}
                        </span>
                        <Button
                          variant="secondary"
                          className="bg-white text-black hover:bg-white/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
