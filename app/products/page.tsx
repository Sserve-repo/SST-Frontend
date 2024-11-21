"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductByCategory } from "@/fetchers/product";

type ProductsItem = {
  id: number;
  image: string;
  title: string;
  price: number;
  categories?: string[];
};

const page = () => {
  const [products, setProducts] = useState<ProductsItem[]>([]);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const handleFetchProduct = async (catId: number) => {
    const response = await getProductByCategory(catId);
    if (response && response.ok) {
      const data = await response.json();
      setProducts(data["Products Items"]);
    } else {
      setProducts([]);
    }
  };
  useEffect(() => {
    if (categoryId) {
      handleFetchProduct(parseInt(categoryId));
    }
  }, []);
  const router = useRouter();
  const featuredProducts = [
    {
      id: 1,
      name: "Triple Rock - Plaster of Paris(POP)",
      categories: ["Home Decor", "House Decoration"],
      price: 2999.99,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      id: 2,
      name: "Premium Ceramic Tiles",
      categories: ["Flooring", "Interior Design"],
      price: 1499.99,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      id: 3,
      name: "Eco-Friendly Paint Set",
      categories: ["Wall Decor", "DIY"],
      price: 799.99,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      id: 4,
      name: "Luxury Bathroom Fixtures",
      categories: ["Plumbing", "Home Improvement"],
      price: 3499.99,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      id: 5,
      name: "Smart Home Lighting System",
      categories: ["Electronics", "Home Automation"],
      price: 1999.99,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      id: 6,
      name: "Hardwood Flooring Kit",
      categories: ["Flooring", "DIY"],
      price: 2499.99,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      id: 7,
      name: "Designer Wallpaper Collection",
      categories: ["Wall Decor", "Interior Design"],
      price: 599.99,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      id: 8,
      name: "Energy-Efficient Windows",
      categories: ["Home Improvement", "Eco-Friendly"],
      price: 4999.99,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
  ];

  const handleAddToCart = async (name: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth/login");
    }
    router.push(`/products/${name.replace(" ", "-").toLocaleLowerCase()}`);
  };

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#502266] text-center mb-12">
          {/* Featured Products */}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product, index) => (
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
                    {product &&
                      product.categories &&
                      product?.categories.map((category, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-[#f4c391] text-black"
                        >
                          {category}
                        </Badge>
                      ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white border border-white rounded-full px-3 py-1">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button
                      variant="secondary"
                      className="bg-white text-black hover:bg-white/90"
                      onClick={() => handleAddToCart(product.title)}
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
            <Input type="," className="w-20" defaultValue="1" />
            <span className="text-sm">of 100</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
