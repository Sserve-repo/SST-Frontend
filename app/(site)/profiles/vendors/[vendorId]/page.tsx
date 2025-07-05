"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ServiceCard } from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { getVendorProfile } from "@/actions/vendors";

type VendorListing = {
  id: string;
  image: string;
  price: number;
  title: string;
  description: string;
};

type Vendor = {
  firstname: string;
  lastname: string;
  service_category: any;
  service_category_item: any;
  artisan_service_listing: VendorListing[];
  artisan_business_details: any;
  artisan_service_area: any;
  artisan_business_policy: any;
};

const Service = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const { vendorId } = useParams();

  const handleFetchVendorProfile = async (id) => {
    const response = await getVendorProfile(id);
    console.log({ response });

    if (response && response.ok) {
      const data = await response.json();
      setVendor(data.data["Artisan Business profile"]);
    }
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
                  {vendor?.artisan_business_details?.service_category?.name}
                </Badge>
                <Badge variant="outline">
                  {
                    vendor?.artisan_business_details?.service_category_item
                      ?.name
                  }
                </Badge>
              </div>

              <Button className="mt-4 w-full">Message </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                We answer quickly, within a few hours
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="text-lg font-semibold">About this service</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {vendor?.artisan_business_details?.business_details}.
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
                  {vendor?.artisan_business_details?.city}
                </p>
                <p className="text-sm">
                  <span className="font-medium">City/Town:</span>{" "}
                  {vendor?.artisan_business_details?.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">My Services</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <>
              {vendor &&
                vendor.artisan_service_listing.map((listing, index) => {
                  return (
                    <ServiceCard
                      key={index}
                      id={listing.id}
                      userId={vendor.artisan_business_details.user_id}
                      title={listing.title}
                      price={listing.price}
                      description={listing.description}
                      rating={4.9}
                      reviews={12}
                      isNew
                      imageUrl={listing?.image}
                    />
                  );
                })}
            </>
          </div>
          <Button variant="outline" className="mt-4">
            View all (3)
          </Button>
        </section>
      </main>
    </Suspense>
  );
};

export default Service;
