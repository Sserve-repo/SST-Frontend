"use client";

import React, { Suspense, useEffect, useState } from "react";
import { getArtisanProfile } from "@/actions/artisans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, MessageCircle, MapPin, Package } from "lucide-react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { ArtisanMessageInitiationModal } from "@/components/messages/artisan-message-initiation-modal";

type ReviewData = {
  id: string;
  avatar: string;
  username: string;
  productId?: number;
  comment: string;
  rating: number;
};

export default function ArtisanProfilePage() {
  const params = useParams();
  const artisanId = params?.artisanId as string;

  const [artisan, setArtisan] = useState<any>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const googleKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
    "";
  const { isLoaded } = useLoadScript({ googleMapsApiKey: googleKey });

  const handleGetArtisan = async (id: string) => {
    try {
      const response = await getArtisanProfile(id);
      if (!response?.ok) {
        throw new Error("Failed to fetch artisan data");
      }
      const data = await response.json();

      setArtisan(data.data["Artisan Business profile"]);

      const rev =
        data.data["Artisan Reviews"]?.map((item: any) => ({
          id: item.id,
          username: item.customer_name,
          comment: item.comment,
          rating: item.rating,
          avatar: item.customer_photo,
        })) || [];
      setReviews(rev);
    } catch (error) {
      console.error("Failed to fetch artisan:", error);
      notFound();
    } finally {
    }
  };

  useEffect(() => {
    if (artisanId) {
      handleGetArtisan(artisanId);
    }
  }, [artisanId]);

  if (!artisan) {
    return (
      <div className="py-32 text-center text-gray-500">
        Loading artisan details...
      </div>
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
              priority
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

              <div className="mt-4 w-full  text-white px-4 py-2 rounded-md flex items-center justify-center gap-2">
                <ArtisanMessageInitiationModal
                  recipientId={artisan?.id}
                  recipientName={artisan.name || "Artisan"}
                  serviceName={"Artisan Inquiry"}
                >
                  <Button className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Artisan
                  </Button>
                </ArtisanMessageInitiationModal>
              </div>

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
                    ({reviews?.length || 0} reviews)
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

            {/* Location (Google Address + Map) */}
            {(() => {
              const address =
                artisan?.google_address ||
                artisan?.artisan_business_details?.address ||
                [
                  artisan?.artisan_business_details?.address_line1,
                  artisan?.artisan_business_details?.address_line2,
                  artisan?.artisan_business_details?.city,
                  artisan?.artisan_business_details?.state,
                  artisan?.artisan_business_details?.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "";

              const latCand =
                artisan?.latitude ??
                artisan?.artisan_business_details?.latitude ??
                artisan?.lat;
              const lngCand =
                artisan?.longitude ??
                artisan?.artisan_business_details?.longitude ??
                artisan?.lng;

              const lat = typeof latCand === "string" ? Number(latCand) : latCand;
              const lng = typeof lngCand === "string" ? Number(lngCand) : lngCand;
              const hasCoords = typeof lat === "number" && typeof lng === "number" && !Number.isNaN(lat) && !Number.isNaN(lng);

              if (!address && !hasCoords) return null;

              return (
                <section className="space-y-4 rounded-lg border p-6 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-[#502266] flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Location
                  </h3>
                  {address && (
                    <div className="text-sm text-gray-700">
                      <span className="break-words">{address}</span>
                    </div>
                  )}
                  {hasCoords ? (
                    isLoaded ? (
                      <div className="h-56 w-full overflow-hidden rounded-lg border">
                        <GoogleMap
                          zoom={14}
                          center={{ lat, lng }}
                          mapContainerStyle={{ width: "100%", height: "100%" }}
                          options={{ streetViewControl: false, mapTypeControl: false }}
                        >
                          <Marker position={{ lat, lng }} />
                        </GoogleMap>
                      </div>
                    ) : (
                      <a
                        className="text-blue-600 underline text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : `https://maps.google.com/?q=${lat},${lng}`}
                      >
                        Open in Google Maps
                      </a>
                    )
                  ) : (
                    address && (
                      <a
                        className="text-blue-600 underline text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                      >
                        View on Google Maps
                      </a>
                    )
                  )}
                </section>
              );
            })()}
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {artisan.artisan_service_listing.map((listing) => (
                <Card
                  key={listing.id}
                  className="overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={
                        listing.image ||
                        "/assets/images/tailor.png?height=300&width=400"
                      }
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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
                          artisan?.artisan_business_details?.service_category
                            ?.name ||
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
                        className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white transition-all duration-300 transform hover:scale-105"
                        size="sm"
                        asChild
                      >
                        <a href={`/booking?serviceId=${listing.id}`}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Now
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Services Available
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This artisan hasn&apos;t listed any services yet. Check back
                later or browse other talented artisans.
              </p>
              <Button className="bg-[#FF7F00] hover:bg-[#FF7F00]/90" asChild>
                <a href="/artisans">Browse Other Artisans</a>
              </Button>
            </div>
          )}
        </section>

        {/* Reviews Section - Server-side rendered */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl py-8">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((review: ReviewData) => (
                <div key={review.id} className="border-t pt-6">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={
                        review.avatar || "/assets/images/avatar-placeholder.png"
                      }
                      alt={review.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{review.username}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No reviews yet. Be the first to leave a review!
              </p>
            )}
          </div>
        </section>
      </main>
    </Suspense>
  );
}
