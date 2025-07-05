"use client";

import React from "react";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/hooks/use-search";
import Link from "next/link";

export default function Hero() {
  const { currentUser } = useAuth();
  const { query, setQuery, results, isLoading, error } = useSearch();
  const products = [
    "Cuisines",
    "Fashion and textiles",
    "Home Decor",
    "Art and craft",
    "Jewelry and accessories",
    "Herbal & wellness products",
  ];

  const services = [
    "Beauty & Fashion",
    "Event Services",
    "Mechanical & Technical Services",
    "Custom Crafting",
    "Cultural & Educational Services",
    "Home Services/Improvement",
  ];

  return (
    <div className="relative h-full w-full overflow-hidden z-10">
      {/* Background Image */}
      <Image
        className="absolute inset-0 object-cover bg-center w-full h-full"
        src="/assets/images/hero.png?height=1080&width=1920"
        alt="background"
        width={1920}
        height={1080}
        priority
      />

      {/* Main Content Section */}
      <div className="relative z-10 flex flex-col w-full min-h-[70vh]">
        <div className="flex-grow container flex min-h-[70vh] items-center w-full mx-auto px-4 py-8 lg:pt-44 pt-36">
          {/* Text Content */}
          <div className="text-white max-w-5xl">
            <p className="text-xl md:text-2xl mb-4">
              Welcome, {currentUser?.firstname ?? "Guest"}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find trusted Vendors & <br className="hidden md:block" /> Artisans
              for your needs.
            </h1>
            <p className="text-xl md:text-2xl text-[#FFDFC0] mb-8">
              Get quality products & services—all in one place.
            </p>

            {/* Search Input and Button */}
            <div className="relative max-w-5xl mb-12">
              <input
                placeholder="I am looking for..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-12 md:h-16 text-md md:text-lg rounded-lg pl-4 pr-24 text-black"
                aria-label="Search products and services"
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center gap-x-4 bg-primary rounded-lg text-white text-sm md:text-base h-10 md:h-12 sm:px-6 px-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Search Results Dropdown */}
              {(query || isLoading || error) && (
                <div className="absolute left-0 w-full mt-2 bg-white shadow rounded-lg p-4 z-50 max-h-72 overflow-auto animate-fade-in">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    </div>
                  ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                  ) : results ? (
                    <>
                      {results.products.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-black text-lg mb-2">
                            Products
                          </h4>
                          {results.products.map((item: any) => (
                            <Link
                              href={`/products/${item?.id}`}
                              key={item.title}
                            >
                              <p className="text-gray-700 hover:text-blue-500 cursor-pointer p-2 rounded hover:bg-gray-50">
                                {item.title}
                              </p>
                            </Link>
                          ))}
                        </div>
                      )}
                      {results.services.length > 0 && (
                        <div className="mt-2">
                          <h4 className="font-semibold text-black text-lg mb-2">
                            Services
                          </h4>
                          {results.services.map((item: any) => (
                            <Link
                              href={`/services/${item?.id}`}
                              key={item.title}
                            >
                              <p className="text-gray-700 hover:text-blue-500 cursor-pointer p-2 rounded hover:bg-gray-50">
                                {item.title}
                              </p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No results found for &quot;{query}&quot;
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products and Services Section */}
        <div className="mt-auto w-full">
          {/* Products Section */}
          <div className="bg-[#FFB46A] py-3 w-full">
            <div className="container mx-auto px-4 w-full">
              <p className="text-[#502266] text-xl md:text-2xl mb-2 text-center">
                Products
              </p>
              <Marquee
                direction="right"
                pauseOnHover={true}
                loop={0}
                className="flex justify-center w-full items-center overflow-x-auto text-[1rem]"
              >
                {[...products, ...products].map((item, index) => (
                  <div
                    key={index}
                    className="bg-orange-100 p-2 mx-2 rounded-lg text-[#240F2E] whitespace-nowrap"
                  >
                    <p>{item}</p>
                  </div>
                ))}
              </Marquee>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-[#9E4FC4] py-4 w-full rounded-b-lg">
            <div className="container w-full mx-auto px-4">
              <p className="text-white text-xl md:text-2xl mb-2 text-center">
                Services
              </p>
              <Marquee
                pauseOnHover={true}
                className="flex justify-center w-full items-center overflow-x-auto text-[1rem]"
              >
                {[...services, ...services].map((item, index) => (
                  <div
                    key={index}
                    className="bg-purple-300 p-2 mx-2 rounded-lg text-[#F9F9F9] whitespace-nowrap"
                  >
                    <p>{item}</p>
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
