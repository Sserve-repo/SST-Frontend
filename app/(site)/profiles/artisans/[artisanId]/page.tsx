"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArtisanProfile } from "@/actions/artisans";
import { ReviewCard } from "@/components/ReviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, MessageCircle, MapPin, Package } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

type ArtisanListing = {
  id: string;
  image: string;
  price: number;
  title: string;
  description: string;
  service_category?: any;
  rating?: number;
  is_favorite?: boolean;
};

type Artisan = {
  firstname: string;
  lastname: string;
  service_category: any;
  service_category_item: any;
  artisan_service_listing: ArtisanListing[];
  artisan_business_details: any;
  artisan_service_area: any;
  artisan_business_policy: any;
};

const Service = () => {
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { artisanId } = useParams();
  const router = useRouter();

  const handleFetchArtisanProfile = async (id) => {
    try {
      setLoading(true);
      const response = await getArtisanProfile(id);
      if (response && response.ok) {
        const data = await response.json();
        setArtisan(data.data["Artisan Business profile"]);
      }
    } catch (error) {
      console.error("Error fetching artisan profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async (serviceId) => {
    router.push(`/booking?serviceId=${serviceId}`);
  };

  const handleMessageArtisan = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    router.push(`/messages/${artisanId}`);
  };

  useEffect(() => {
    if (artisanId) {
      handleFetchArtisanProfile(artisanId);
    }
  }, [artisanId]);

  if (loading) {
    return (
      <main className="py-32 w-full mx-auto max-w-7xl p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#502266] mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading artisan profile...</p>
        </div>
      </main>
    );
  }

  if (!artisan) {
    return (
      <main className="py-32 w-full mx-auto max-w-7xl p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Artisan Not Found
          </h1>
          <p className="text-gray-600">
            The artisan profile you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/artisans")} className="mt-4">
            Browse Other Artisans
          </Button>
        </div>
      </main>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="py-32 w-full mx-auto max-w-7xl p-4">
        <div className="mb-8 grid gap-8 md:grid-cols-[1fr_400px]">
          {/* Main Image */}
          <div className="relative aspect-video rounded-lg bg-gray-100 overflow-hidden">
            <Image
              src={
                artisan?.artisan_business_details?.image ||
                "/assets/images/tailor.png?height=300&width=400"
              }
              alt="Artisan workshop"
              fill
              className="rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-2xl font-bold">
                {`${artisan?.firstname} ${artisan?.lastname}`}&apos;s Workshop
              </h1>
            </div>
          </div>

          {/* Profile Section */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <Image
                    src={
                      artisan?.artisan_business_details?.image ||
                      "/assets/images/tailor.png?height=300&width=400"
                    }
                    alt="Profile"
                    width={60}
                    height={60}
                    className="rounded-md bg-gray-100 object-cover"
                  />
                  <div>
                    <h1 className="text-xl font-semibold text-[#502266]">
                      {`${artisan?.firstname} ${artisan?.lastname}`}
                    </h1>
                    <p className="text-sm text-gray-600">
                      Professional Artisan
                    </p>
                  </div>
                </div>
                <Badge className="flex items-center bg-[#FF7F00] hover:bg-[#FF7F00]/90 gap-1">
                  <Star className="h-3 w-3" />
                  Verified
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-[#502266] text-[#502266]"
                >
                  {artisan?.artisan_business_details?.service_category?.name}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[#FF7F00] text-[#FF7F00]"
                >
                  {
                    artisan?.artisan_business_details?.service_category_item
                      ?.name
                  }
                </Badge>
              </div>

              <Button
                onClick={handleMessageArtisan}
                className="mt-4 w-full bg-[#502266] hover:bg-[#502266]/90"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Artisan
              </Button>
              <p className="mt-2 text-center text-xs text-gray-600">
                We respond quickly, usually within a few hours
              </p>
            </div>

            <div className="rounded-lg border p-6 bg-white shadow-sm">
              <h2 className="text-lg font-semibold text-[#502266] mb-3">
                About this artisan
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {artisan?.artisan_business_details?.business_details ||
                  "This artisan provides quality services with attention to detail and customer satisfaction."}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.5</span>
                  <span className="text-sm text-gray-600">
                    (24 completed orders)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Location:</span>{" "}
                    {artisan?.artisan_business_details?.city || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Services:</span>{" "}
                    {artisan?.artisan_service_listing?.length || 0} available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-[#502266]">
              Available Services
            </h2>
            <Badge variant="outline" className="text-sm">
              {artisan?.artisan_service_listing?.length || 0} services
            </Badge>
          </div>

          {artisan?.artisan_service_listing &&
          artisan.artisan_service_listing.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {artisan.artisan_service_listing.map((listing) => (
                  <div
                    key={listing.id}
                    className="transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Card
                      className={`overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105
                      }`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={
                            listing.image ||
                            "/assets/images/tailor.png?height=300&width=400"
                          }
                          alt={listing.title}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Price Badge */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Badge className="bg-[#FF7F00] text-white border-none">
                            ${parseFloat(listing.price.toString()).toFixed(2)}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="bg-[#240F2E] text-white p-4 relative overflow-hidden">
                        <div className="relative z-10">
                          <h3 className="text-lg font-semibold text-[#FF7F00] mb-2 line-clamp-2 group-hover:text-white transition-colors duration-300">
                            {listing.title}
                          </h3>

                          <Badge
                            variant="secondary"
                            className="mb-3 bg-white/10 text-white border-white/20"
                          >
                            {listing.service_category?.name ||
                              artisan?.artisan_business_details
                                ?.service_category?.name ||
                              "Service"}
                          </Badge>

                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm flex items-center">
                              ⭐⭐⭐⭐⭐
                              <span className="ml-1">(4.5)</span>
                            </p>
                            <span className="text-[#FF7F00] font-semibold">
                              ${parseFloat(listing.price.toString()).toFixed(2)}
                            </span>
                          </div>

                          <Button
                            onClick={() => handleBookService(listing.id)}
                            className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white transition-all duration-300 transform hover:scale-105"
                            size="sm"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {artisan.artisan_service_listing.length > 4 && (
                <div className="text-center mt-6">
                  <Button
                    variant="outline"
                    className="border-[#502266] text-[#502266] hover:bg-[#502266] hover:text-white"
                  >
                    View all ({artisan.artisan_service_listing.length}) services
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Services Available
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This artisan hasn&apos;t listed any services yet. Check back later or
                browse other talented artisans.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => router.push("/artisans")}
                  className="bg-[#FF7F00] hover:bg-[#FF7F00]/90"
                >
                  Browse Other Artisans
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Reviews Section */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#502266]">
              Customer Reviews
            </h2>
            <select className="rounded-md border p-2 text-sm">
              <option>Sort by Recent</option>
              <option>Sort by Rating</option>
              <option>Sort by Helpful</option>
            </select>
          </div>
          <div className="space-y-4">
            <ReviewCard
              author="James Smith"
              date="Oct 27, 2023"
              rating={5}
              content="Outstanding work! The artisan delivered exactly what I needed with excellent attention to detail."
            />
            <ReviewCard
              author="Sarah Johnson"
              date="Oct 22, 2023"
              rating={4}
              content="Great service and professional communication. Would definitely recommend and hire again."
            />
          </div>
        </section>
      </main>
    </Suspense>
  );
};

export default Service;
