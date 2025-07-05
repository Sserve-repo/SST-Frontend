"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import { getVendorProfile } from "@/actions/vendors";
import { Card, CardContent } from "@/components/ui/card";
import router from "next/router";
import { MessageInitiationModal } from "@/components/messages/message-initiation-modal";
import { useCart } from "@/context/CartContext";
import Cookies from "js-cookie";

type VendorListing = {
  id: string;
  image: string;
  price: number;
  title: string;
  description: string;
  category?: any;
};

type Vendor = {
  id: string;
  firstname: string;
  lastname: string;
  vendor_category: any;
  vendor_category_item: any;
  vendor_service_listing: VendorListing[];
  vendor_business_details: any;
  vendor_vendor_area: any;
  vendor_business_policy: any;
};

const VendorShop = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const { addToCart } = useCart();
  const { vendorId } = useParams();

  const handleFetchVendorProfile = async (id) => {
    const response = await getVendorProfile(id);
    console.log({ response });

    if (response && response.ok) {
      const data = await response.json();
      setVendor(data.data["Vendor Business profile"]);
    }
  };

  const handleAddToCart = async (product) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    await addToCart({
      product_id: product.id,
      quantity: 1,
      unit_price: product.price,
      title: product.title,
      image: product.image,
    });
  };

  useEffect(() => {
    if (vendorId) {
      handleFetchVendorProfile(vendorId);
    }
  }, [vendorId]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="py-32 w-full mx-auto max-w-7xl p-4">
        <div className="mb-8 grid gap-8 md:grid-cols-[1fr_400px]">
          {/* Main Image */}
          <div className="relative aspect-video rounded-lg bg-gray-100">
            <Image
              src="/assets/images/tailor.png?height=300&width=400"
              alt="Service preview"
              fill
              className="rounded-lg object-cover"
            />
          </div>

          {/* Profile Section */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <Image
                    src="/assets/images/tailor.png?height=300&width=400"
                    alt="Profile"
                    width={60}
                    height={60}
                    className="rounded-md bg-gray-100"
                  />
                  <div>
                    <h1 className="text-xl font-semibold">
                      {`${vendor?.firstname} ${vendor?.lastname}`}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Add to Favorite Artisan
                    </p>
                  </div>
                </div>
                <Badge className="flex items-center bg-purple-400 gap-1">
                  <Star className="h-3 w-3" />
                  Star Artisan
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">
                  {vendor?.vendor_business_details?.service_category?.name}
                </Badge>
                <Badge variant="outline">
                  {vendor?.vendor_business_details?.service_category_item?.name}
                </Badge>
              </div>

              <MessageInitiationModal
                recipientId={vendor?.id as string}
                recipientName={
                  `${vendor?.firstname} ${vendor?.lastname}` || "Vendor"
                }
                productName={vendor?.firstname}
              >
                <Button className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Seller
                </Button>
              </MessageInitiationModal>

              <p className="mt-2 text-center text-xs text-muted-foreground">
                We answer quickly, within a few hours
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="text-lg font-semibold">About this service</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {vendor?.vendor_business_details?.business_details}.
              </p>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.5</span>
                  <span className="text-sm text-muted-foreground">
                    (24 orders in queue)
                  </span>
                </div>
                <p className="mt-2 text-sm">
                  <span className="font-medium">Shop Address:</span>{" "}
                  {vendor?.vendor_business_details?.city}
                </p>
                <p className="text-sm">
                  <span className="font-medium">City/Town:</span>{" "}
                  {vendor?.vendor_business_details?.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        {/* Services Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-[#502266]">
              Available Products
            </h2>
            <Badge variant="outline" className="text-sm">
              {vendor?.vendor_service_listing?.length || 0} services
            </Badge>
          </div>

          {vendor?.vendor_service_listing &&
          vendor.vendor_service_listing.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {vendor.vendor_service_listing.map((listing) => (
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
                            {listing.category?.name ||
                              vendor?.vendor_business_details?.product_category
                                ?.name ||
                              "Product"}
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
                            onClick={() => handleAddToCart(listing)}
                            className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white transition-all duration-300 transform hover:scale-105"
                            size="sm"
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Services Available
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This vendor hasn&apos;t listed any services yet. Check back
                later or browse other talented artisans.
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
      </main>
    </Suspense>
  );
};

export default VendorShop;
