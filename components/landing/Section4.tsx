"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const Section4 = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const vendors = [
    {
      name: "Building Solutions Co.",
      description: "Reliable Supplier for Builders",
      rating: 3.5,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      name: "Tech Gadgets Inc.",
      description: "Cutting-edge Electronics Supplier",
      rating: 4.2,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      name: "Green Thumb Nursery",
      description: "Quality Plants and Gardening Supplies",
      rating: 4.8,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      name: "Gourmet Ingredients Co.",
      description: "Premium Food Products Supplier",
      rating: 4.5,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      name: "Artistic Creations Ltd.",
      description: "Unique Handcrafted Art Supplies",
      rating: 4.0,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      name: "Fitness Gear Pro",
      description: "Top-quality Exercise Equipment",
      rating: 4.7,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      name: "Auto Parts Express",
      description: "Reliable Automotive Components",
      rating: 4.3,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      name: "Eco-Friendly Packaging",
      description: "Sustainable Packaging Solutions",
      rating: 4.6,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
  ];

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#502266] text-center mb-12">
          Recommended Vendors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vendors.map((vendor, index) => (
            <Card
              key={index}
              className="overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative h-48">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
                {hoveredIndex === index && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 bg-white rounded-full"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardContent className="bg-[#240F2E] text-white p-4 h-48 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{vendor.name}</h3>
                  <p className="text-sm text-[#FFCA95]">{vendor.description}</p>
                  <p className="text-sm mt-2">
                    ⭐ ({vendor.rating.toFixed(1)}/5.0)
                  </p>
                </div>
                <CardFooter className="p-0">
                  <Button className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white rounded-full">
                    Explore
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section4;
