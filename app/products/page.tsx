"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FilterIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const page = () => {
  const router = useRouter();
  const [sortOption, setSortOption] = useState("Most Relevant");
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
    <section className="bg-white py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
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

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#502266] text-center mb-12">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardContent className="bg-[#FF9F3F] p-4  h-full">
                <h3 className="text-lg font-semibold text-black mb-2">
                  {product.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.categories.map((category, idx) => (
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
                    onClick={() => handleAddToCart(product.name)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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

export default page;
