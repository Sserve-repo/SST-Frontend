"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRecommendedArtisans } from "@/actions/artisans";

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

const RecommendedArtisans = () => {
  const router = useRouter();
  const [artisans, setArtisans] = useState<Artisan[]>([]);

  const handleRedirect = (id) => {
    router.push(`profiles/artisans/${id}`);
  };

  const handleFetchRecommendedArtisan = async () => {
    const response = await getRecommendedArtisans();
    if (response && response.ok) {
      const data = await response.json();
      setArtisans(data.data["Artisans"]);
    }
  };

  useEffect(() => {
    handleFetchRecommendedArtisan();
  }, []);

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="mb-16">
          {/* Title and Explore Link Row */}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#502266]">
              Recommended Artisans
            </h2>
            <Link
              href="/artisan"
              className="text-[#FF7F00] hover:text-[#502266] font-medium transition-colors duration-300 flex items-center gap-1 self-start sm:self-auto"
            >
              Explore
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Description Text - Left Aligned */}
          <div className="text-left">
            <p className="text-gray-600 text-lg max-w-2xl">
              Connect with skilled artisans who bring creativity and
              craftsmanship to life. Each artisan is carefully selected for
              their expertise and dedication to quality.
            </p>
          </div>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7F00] to-[#502266] mt-4"></div>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artisans &&
            artisans.map((artisan, index) => (
              <Card
                key={index}
                className="overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative">
                  <Image
                    src={
                      artisan?.image ??
                      "/assets/images/tailor.png?height=300&width=400"
                    }
                    alt={artisan.firstname}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-[#502266]">
                    {`${artisan.firstname} ${artisan.lastname}`}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-[#502266]/10 text-[#502266] border-[#FF7F00]/20"
                    >
                      {artisan.service_category_name}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-[#502266]/10 text-[#502266] border-[#502266]/20"
                    >
                      {artisan.service_category_items_name}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    ⭐ ({artisan?.rating?.toFixed(1) || "4.0"}/5.0)
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleRedirect(artisan.id)}
                    className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white transition-all duration-300 transform hover:scale-105"
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

export default RecommendedArtisans;
