"use client";

import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import Marquee from "react-fast-marquee";

export default function Hero() {
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
      />

      {/* Main Content Section */}
      <div className="relative z-10 flex flex-col w-full min-h-[70vh]">
        <div className="flex-grow container flex min-h-[70vh] item-center w-full mx-auto px-4 py-8 lg:pt-44 pt-36">
          {/* Text Content */}
          <div className="text-white max-w-3xl">
            <p className="text-xl md:text-2xl mb-4">Welcome, AgboCity</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find trusted Vendors & Artisans for your needs.
            </h1>
            <p className="text-xl md:text-2xl text-[#FFDFC0] mb-8">
              Get quality products & services—all in one place.
            </p>

            {/* Search Input and Button */}
            <div className="relative max-w-2xl mb-12">
              <input
                placeholder="I am looking for..."
                className="w-full h-12 md:h-16 text-md md:text-lg rounded-lg pl-4 pr-24 text-black"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center gap-x-4 bg-black rounded-lg text-white text-sm md:text-base h-10 md:h-12 sm:px-6 px-4">
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
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
                direction="left"
                pauseOnHover={true}
                loop={0}
                className="flex justify-center w-full items-center overflow-x-auto text-[1rem]"
              >
                {[...services, ...services].map((item, index) => (
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
        </div>
      </div>
    </div>
  );
}
