"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { getServiceByCategory } from "@/actions/service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ServicesItem = {
  id: number;
  image: string;
  title: string;
  price: number;
  category: any;
  subcategory: any;
};

const ServicePage = () => {
  const [services, setServices] = useState<ServicesItem[]>([]);
  // const [sortOption, setSortOption] = useState("Most Rvant");

  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get("categoryId");
  const categoryName = searchParams.get("categoryName");

  const handleFetchService = async (catId: number) => {
    const response = await getServiceByCategory(catId);
    if (response && response.ok) {
      const data = await response.json();
      setServices(data.data["Services"]);
    } else {
      setServices([]);
    }
  };
  useEffect(() => {
    if (categoryId) {
      handleFetchService(parseInt(categoryId));
    }
  }, [categoryId]);

  const handleHireNow = async (id: number) => {
    router.push(`/artisan-profile/${id}`);
  };

  // Derived sorting (avoiding infinite loop)
  // const sortedServices = React.useMemo(() => {
  //   if (!services || services.length === 0) return [];

  //   const sorted = [...services];
  //   if (sortOption === "Price: low to high") {
  //     sorted.sort((a, b) => a.price - b.price);
  //   } else if (sortOption === "Price: high to low") {
  //     sorted.sort((a, b) => b.price - a.price);
  //   } else if (sortOption === "Newest") {
  //     sorted.sort((a, b) => b.id - a.id);
  //   }
  //   return sorted;
  // }, [services, sortOption]);

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

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#502266] text-center mb-12">
          {/* Featured Products */}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services && services.length > 0 ? (
            services.map((service, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-4  h-full">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {service.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{categoryName}</Badge>
                    <Badge variant="secondary">{`${service.title}`}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black border border-white rounded-full px-3 py-1">
                      ${service.price}
                    </span>
                    <Button
                      className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white"
                      onClick={() => handleHireNow(service.id)}
                    >
                      Hire Now!
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

export default ServicePage;
