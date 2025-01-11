"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FilterIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductByCategory, getProductList } from "@/actions/product";
import {  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type ProductsItem = {
  id: number;
  image: string;
  title: string;
  price: number;
  category: any;
  subcategory: any;
};

const ProductPage = () => {
  const [products, setProducts] = useState<ProductsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("Most Relevant");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = async (product: ProductsItem) => {
    await addToCart({
      product_id: product.id,
      quantity: 1,
      unit_price: product.price.toString(),
      title: product.title,
      image: product.image,
    });
  };

  const handleProductClick = (product: ProductsItem) => {
    router.push(
      `/products/${product.id}/?title=${product.title
        .replace(/\s+/g, "-")
        .toLowerCase()}`
    );
  };

  const categoryId = searchParams.get("categoryId");
  const subCategoryId = searchParams.get("subCategoryId");

  const handleFetchProduct = async (catId: number, subCat: any) => {
    setIsLoading(true);
    const response = await getProductByCategory(catId, subCat);
    if (response && response.ok) {
      const data = await response.json();
      setProducts(data.data["product_listing"]);
    } else {
      setProducts([]);
    }
    setIsLoading(false);
  };

  const handleFetchProductList = async () => {
    setIsLoading(true);
    const response = await getProductList();
    if (response && response.ok) {
      const data = await response.json();
      setProducts(data.data["product_listing"]);
    } else {
      setProducts([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (categoryId && subCategoryId) {
      handleFetchProduct(parseInt(categoryId), parseInt(subCategoryId));
    } else if (categoryId) {
      handleFetchProduct(parseInt(categoryId), "");
    } else {
      handleFetchProductList();
    }
  }, [categoryId, subCategoryId]);

  const sortedProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];

    const sorted = [...products];
    if (sortOption === "Price: low to high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price: high to low") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === "Newest") {
      sorted.sort((a, b) => b.id - a.id);
    }
    return sorted;
  }, [products, sortOption]);

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
    <>
      <div className="min-h-screen bg-white justify-center flex">
        {isLoading ? (
          <div className="container mx-auto px-4 md:px-6 mt-32">
            <SkeletonLoader />
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="container w-full mx-auto flex justify-center items-center flex-col h-screen px-4 py-4 text-center">
            <h1 className="text-2xl font-bold mb-4">No Products Found</h1>
            <p className="mb-4">
              Looks like the page you are looking for does not have any data yet.
            </p>
            <Link href="/products">
              <Button>Continue</Button>
            </Link>
          </div>
        ) : (
          <section className="bg-white py-12 md:py-24 min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 mt-8">
                <Button className="border-bg-[#502266] flex items-center border px-4 bg-transparent text-black hover:text-white hover:bg-[#502266]/90">
                  <FilterIcon className="px-1" />
                  Filter All
                </Button>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Sort By:</span>
                  <Select
                    onValueChange={(value) => setSortOption(value)}
                    defaultValue="Most Relevant"
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Most Relevant">Most Relevant</SelectItem>
                      <SelectItem value="Price: low to high">
                        Price: low to high
                      </SelectItem>
                      <SelectItem value="Price: high to low">
                        Price: high to low
                      </SelectItem>
                      <SelectItem value="Top Reviews">Top Reviews</SelectItem>
                      <SelectItem value="Newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div
                        className="relative h-48"
                        onClick={() => handleProductClick(product)}
                      >
                        <Image
                          src={product.image}
                          alt={product.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg cursor-pointer"
                        />
                      </div>
                      <CardContent className="bg-[#FF9F3F] p-4  h-full">
                        <h3
                          className="text-lg font-semibold text-black mb-2 cursor-pointer hover:underline"
                          onClick={() => handleProductClick(product)}
                        >
                          {product.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge
                            variant="secondary"
                            className="bg-[#f4c391] text-black"
                          >
                            {`${product.category.name}`}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-[#f4c391] text-black"
                          >
                            {`${product.subcategory.name}`}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white border border-white rounded-full px-3 py-1">
                            ${product.price}
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
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ProductPage;
