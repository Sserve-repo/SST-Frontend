import React, { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Package, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { getVendorProfile } from "@/actions/vendors";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface VendorProfilePageProps {
  params: {
    vendorId: string;
  };
}

// Server-side data fetching
async function getVendorData(vendorId: string) {
  try {
    const response = await getVendorProfile(vendorId);
    if (!response?.ok) {
      return null;
    }
    
    const data = await response.json();
    return {
      vendor: data.data["Vendor Business profile"],
    };
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    return null;
  }
}

// Static metadata generation
export async function generateMetadata({ params }: VendorProfilePageProps) {
  const data = await getVendorData(params.vendorId);
  
  if (!data) {
    return {
      title: "Vendor Not Found",
      description: "The vendor profile you're looking for doesn't exist."
    };
  }

  const { vendor } = data;
  
  return {
    title: `${vendor?.firstname} ${vendor?.lastname} - Professional Vendor`,
    description: `Shop from ${vendor?.firstname}'s professional vendor store. ${vendor?.vendor_business_details?.business_details || 'Quality products with great customer service.'}`,
    keywords: `vendor, ${vendor?.vendor_business_details?.vendor_category?.name}, ${vendor?.vendor_business_details?.city}`,
    openGraph: {
      title: `${vendor?.firstname} ${vendor?.lastname} - Professional Vendor`,
      description: vendor?.vendor_business_details?.business_details || 'Quality products with great customer service.',
      images: [vendor?.vendor_business_details?.image || '/assets/images/vendor-placeholder.png'],
    },
  };
}

export default async function VendorProfilePage({ params }: VendorProfilePageProps) {
  const data = await getVendorData(params.vendorId);
  
  if (!data) {
    notFound();
  }

  const { vendor } = data;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="py-32 w-full mx-auto max-w-7xl p-4">
        <div className="mb-8 grid gap-8 md:grid-cols-[1fr_400px]">
          {/* Main Image */}
          <div className="relative aspect-video rounded-lg bg-gray-100 overflow-hidden">
            <Image
              src={
                vendor?.vendor_business_details?.image ||
                "/assets/images/vendor-placeholder.png"
              }
              alt="Vendor shop"
              fill
              className="rounded-lg object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-2xl font-bold">
                {`${vendor?.firstname} ${vendor?.lastname}`}&apos;s Shop
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
                      vendor?.vendor_business_details?.image ||
                      "/assets/images/vendor-placeholder.png"
                    }
                    alt="Profile"
                    width={60}
                    height={60}
                    className="rounded-md bg-gray-100 object-cover"
                  />
                  <div>
                    <h1 className="text-xl font-semibold text-[#502266]">
                      {`${vendor?.firstname} ${vendor?.lastname}`}
                    </h1>
                    <p className="text-sm text-gray-600">
                      Professional Vendor
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
                  {vendor?.vendor_business_details?.vendor_category?.name}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[#FF7F00] text-[#FF7F00]"
                >
                  {vendor?.vendor_business_details?.vendor_category_item?.name}
                </Badge>
              </div>

              <div className="mt-4 w-full bg-[#502266] hover:bg-[#502266]/90 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Message Vendor
              </div>

              <p className="mt-2 text-center text-xs text-gray-600">
                We respond quickly, usually within a few hours
              </p>
            </div>

            <div className="rounded-lg border p-6 bg-white shadow-sm">
              <h2 className="text-lg font-semibold text-[#502266] mb-3">
                About this vendor
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {vendor?.vendor_business_details?.business_details ||
                  "This vendor provides quality products with great customer service and attention to detail."}
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
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Products:</span>{" "}
                    {vendor?.vendor_product_listing?.length || 0} available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-[#502266]">
              Available Products
            </h2>
            <Badge variant="outline" className="text-sm">
              {vendor?.vendor_product_listing?.length || 0} products
            </Badge>
          </div>

          {vendor?.vendor_product_listing &&
          vendor.vendor_product_listing.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vendor.vendor_product_listing.map((product: any) => (
                <Card
                  key={product.id}
                  className="overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={
                        product.image ||
                        "/assets/images/product-placeholder.png"
                      }
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge className="bg-[#FF7F00] text-white border-none">
                        ${parseFloat(product.price.toString()).toFixed(2)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="bg-[#240F2E] text-white p-4 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-[#FF7F00] mb-2 line-clamp-2 group-hover:text-white transition-colors duration-300">
                        {product.title}
                      </h3>

                      <Badge
                        variant="secondary"
                        className="mb-3 bg-white/10 text-white border-white/20"
                      >
                        {product.category?.name ||
                          vendor?.vendor_business_details?.vendor_category
                            ?.name ||
                          "Product"}
                      </Badge>

                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm flex items-center">
                          ⭐⭐⭐⭐⭐
                          <span className="ml-1">(4.5)</span>
                        </p>
                        <span className="text-[#FF7F00] font-semibold">
                          ${parseFloat(product.price.toString()).toFixed(2)}
                        </span>
                      </div>

                      <Button
                        className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white transition-all duration-300 transform hover:scale-105"
                        size="sm"
                        asChild
                      >
                        <a href={`/cart?productId=${product.id}`}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
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
                No Products Available
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This vendor hasn&apos;t listed any products yet. Check back
                later or browse other vendors.
              </p>
              <Button
                className="bg-[#FF7F00] hover:bg-[#FF7F00]/90"
                asChild
              >
                <a href="/vendors">Browse Other Vendors</a>
              </Button>
            </div>
          )}
        </section>
      </main>
    </Suspense>
  );
}
