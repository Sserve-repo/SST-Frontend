"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getFeaturedArtisans } from "@/actions/artisans";

type Artisan = {
  id: string;
  firstname: string;
  lastname: string;
  name: string;
  service_category_name: string;
  service_category_items_name: string;
  rating: number;
  image: string;
};

const Section3 = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const router = useRouter();
  const [artisans, setArtisans] = useState<Artisan[]>([]);

  const handleRedirect = (id) => {
    router.push(`artisan-profile/${id}`);
  };

  const handleFetchFuturedArtisan = async () => {
    const response = await getFeaturedArtisans();
    if (response && response.ok) {
      const data = await response.json();
      setArtisans(data.data["Artisans"]);
    }
  };

  useEffect(() => {
    handleFetchFuturedArtisan();
  }, []);

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#502266] text-center mb-12">
          Recommended Artisans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artisans &&
            artisans.map((artisan, index) => (
              <Card
                key={index}
                className="overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative">
                  <Image
                    src={"/assets/images/tailor.png?height=300&width=400"}
                    alt={artisan.firstname}
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
                  <h3 className="text-lg font-semibold mb-2">{`${artisan.firstname} ${artisan.lastname}`}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">
                      {artisan.service_category_name}
                    </Badge>
                    <Badge variant="secondary">
                      {artisan.service_category_items_name}
                    </Badge>
                  </div>
                  <p className="text-sm">
                    ⭐ ({artisan?.rating?.toFixed(1)}4/5.0)
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleRedirect(artisan.id)}
                    className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white"
                  >
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
