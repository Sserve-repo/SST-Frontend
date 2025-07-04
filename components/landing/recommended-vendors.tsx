"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRecommendedVendors } from "@/actions/vendors";

type Vendor = {
  id: string;
  firstname: string;
  lastname: string;
  business_name: string;
  product_category_name: string;
  rating: number;
  image: string;
};

const RecommendedVendors = () => {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const handleRedirect = (id) => {
    router.push(`/profiles/vendors/${id}`);
  };

  const getVendorFullname = (vendor: Vendor) => {
    return vendor?.firstname + " " + vendor?.lastname;
  };

  const handleFetchRecommendedVendors = async () => {
    const response = await getRecommendedVendors();
    if (response && response.ok) {
      const data = await response.json();
      setVendors(data.data["Vendors"]);
    }
  };

  useEffect(() => {
    handleFetchRecommendedVendors();
  }, []);

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="mb-16">
          {/* Title and Explore Link Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#502266]">
              Recommended Vendors
            </h2>
            <Link
              href="/products"
              className="text-[#FF7F00] hover:text-[#502266] font-medium transition-colors duration-300 flex items-center gap-1 self-start sm:self-auto"
            >
              Explore
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Description Text - Left Aligned */}
          <div className="text-left">
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl">
              Discover trusted vendors who offer high-quality products and
              exceptional service. Browse through our curated selection of
              reliable business partners.
            </p>
          </div>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7F00] to-[#502266] mt-4"></div>
        </div>

        {/* Vendors Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {vendors?.map((vendor, index) => (
            <Card
              key={index}
              className="overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative">
                <Image
                  src={
                    vendor.image ??
                    "/assets/images/tailor.png?height=300&width=400"
                  }
                  alt={vendor.firstname}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-[#502266] truncate">
                  {getVendorFullname(vendor)}
                </h3>

                {/* Business Name with Shop Icon */}
                <div className="flex items-center gap-2 mb-2">
                  <Store className="h-4 w-4 text-[#FF7F00] flex-shrink-0" />
                  <p className="text-sm text-[#FF7F00] font-medium truncate">
                    {vendor.business_name}
                  </p>
                </div>

                {/* Product Category Badge */}
                {vendor.product_category_name && (
                  <Badge
                    variant="secondary"
                    className="bg-[#502266]/10 text-[#502266] border-[#502266]/20 mb-2 text-xs"
                  >
                    {vendor.product_category_name}
                  </Badge>
                )}

                <p className="text-sm text-gray-600">
                  ⭐ ({vendor?.rating?.toFixed(1) || "4.0"}/5.0)
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleRedirect(vendor.id)}
                  className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Explore Shop
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedVendors;
