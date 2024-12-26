"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FilterIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductByCategory, getProductList } from "@/actions/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [sortOption, setSortOption] = useState("Most Relevant");
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = searchParams.get("categoryId");

  const handleFetchProduct = async (catId: number) => {
    const response = await getProductByCategory(catId);
    if (response && response.ok) {
      const data = await response.json();
      setProducts(data.data["product_listing"]);
    } else {
      setProducts([]);
    }
  };

  const handleFetchProductList = async () => {
    const response = await getProductList();
    if (response && response.ok) {
      const data = await response.json();
      setProducts(data.data["product_listing"]);
    } else {
      setProducts([]);
    }
  };

  useEffect(() => {
    if (categoryId) {
      handleFetchProduct(parseInt(categoryId));
    } else {
      handleFetchProductList();
    }
  }, [categoryId]);

  // Derived sorting (avoiding infinite loop)
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

  const handleAddToCart = async (data: any) => {
    const { id, title } = data;
    router.push(
      `/products/${id}/?title=${title.replace(" ", "-").toLocaleLowerCase()}`
    );
  };

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 mt-8">
          <Button className="border-bg-[#502266] flex items-center border px-4 bg-transparent text-black  hover:text-white hover:bg-[#502266]/90">
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

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#502266] text-center mb-12"></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts && sortedProducts.length > 0 ? (
            sortedProducts.map((product, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <CardContent className="bg-[#FF9F3F] p-4  h-full">
                  <h3 className="text-lg font-semibold text-black mb-2">
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
                      onClick={() =>
                        handleAddToCart({
                          id: product.id,
                          title: product.title,
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="h-screen flex flex-col items-center text-center justify-center w-full">
              <h1>No data found</h1>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-8">
          <Button className="bg-[#502266] text-white hover:bg-[#502266]/90 mb-4 sm:mb-0">
            Next Page
          </Button>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Page</span>
            <Input type="number" className="w-20" defaultValue="1" />
            <span className="text-sm">of 100</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
