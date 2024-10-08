"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Section3 = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const artisans = [
    {
      name: "Adebayo Craftsman",
      skills: ["Carpentry", "Furniture Design"],
      rating: 3.5,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Chioma Tailor",
      skills: ["Fashion Design", "Alterations"],
      rating: 4.2,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Kwesi Electrician",
      skills: ["Electrical Repairs", "Installations"],
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Amina Chef",
      skills: ["Catering", "Baking"],
      rating: 4.5,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Oluwaseun Painter",
      skills: ["Interior Painting", "Exterior Painting"],
      rating: 4.0,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Fatima Hairstylist",
      skills: ["Haircuts", "Styling"],
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Kofi Plumber",
      skills: ["Plumbing Repairs", "Installations"],
      rating: 4.3,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Zainab Makeup Artist",
      skills: ["Bridal Makeup", "Special Effects"],
      rating: 4.6,
      image: "/placeholder.svg?height=300&width=400",
    },
  ];

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#502266] text-center mb-12">
          Recommended Artisans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artisans.map((artisan, index) => (
            <Card
              key={index}
              className="overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative">
                <Image
                  src={artisan.image}
                  alt={artisan.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
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
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{artisan.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {artisan.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm">⭐ ({artisan.rating.toFixed(1)}/5.0)</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white">
                  Hire Now!
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section3;
