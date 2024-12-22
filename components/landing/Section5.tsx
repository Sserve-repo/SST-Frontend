"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Section5 = () => {
  const featuredServices = [
    {
      title: "Wooden Sculpture - (African Elephant)",
      category: "Home Decor",
      rating: 3.5,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      title: "Custom Portrait Painting",
      category: "Art",
      rating: 4.2,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      title: "Handcrafted Leather Bag",
      category: "Fashion",
      rating: 4.8,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      title: "Bespoke Furniture Design",
      category: "Home Decor",
      rating: 4.5,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      title: "Traditional Beadwork Jewelry",
      category: "Accessories",
      rating: 4.0,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      title: "Customized Pottery Set",
      category: "Home Decor",
      rating: 4.7,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      title: "Handwoven Tapestry",
      category: "Art",
      rating: 4.3,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
    {
      title: "Carved Wooden Mask",
      category: "Art",
      rating: 4.6,
      image: "/assets/images/tailor.png?height=300&width=400",
    },
  ];

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#502266] text-center mb-12">
          Featured Services
        </h2>
        <div className="border-2 border-slate-800 rounded-2xl p-4 md:p-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredServices.map((service, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <CardContent className="bg-[#240F2E] text-white p-4 h-full">
                  <h3 className="text-lg font-semibold text-[#FF7F00] mb-2">
                    {service.title}
                  </h3>
                  <Badge variant="secondary" className="mb-2">
                    {service.category}
                  </Badge>
                  <div className="flex justify-between items-center">
                    <p className="text-sm">
                      {"⭐".repeat(Math.round(service.rating))} (
                      {service.rating.toFixed(1)}/5.0)
                    </p>
                    <Button variant="secondary" size="sm">
                      Book Now
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
      </div>
    </section>
  );
};

export default Section5;
