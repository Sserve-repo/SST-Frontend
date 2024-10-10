"use client";

import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";

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
    <div className="relative h-screen w-full overflow-hidden ">
      {/* Background Image */}
      <Image
        className="absolute inset-0 object-cover w-full h-full"
        src="/assets/images/hero.png?height=1080&width=1920"
        alt="background"
        width={1920}
        height={1080}
      />

      {/* Main Content Section */}
      <div className="absolute z-10 bottom-16 flex flex-col w-full">
        <div className=" flex-grow container flex item-center w-full mx-auto px-4 py-48 lg:pt-64">
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
                className="w-full h-12 md:h-16 text-lg md:text-xl rounded-lg pl-4 pr-24 text-black"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center gap-x-2 bg-black rounded-lg text-white text-sm md:text-base h-10 md:h-12 px-3">
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products and Services Section */}
      <div className="absolute z-10  bottom-0 pt-6 w-full ">
        {/* Products Section */}
        <div className="bg-[#FFB46A] py-2 w-full">
          <div className="container mx-auto px-4 w-full">
            <p className="text-[#502266] text-xl md:text-2xl mb-2 text-center">
              Products
            </p>
            <div className="flex justify-center w-full items-center overflow-x-auto gap-4  text-[1rem] animate-scroll-reverse">
              {[...products, ...products].map((item, index) => (
                <div
                  key={index}
                  className="bg-orange-100 p-2 rounded-lg text-[#240F2E] whitespace-nowrap"
                >
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-[#9E4FC4] flex flex-col py-2 justify-center items-center text-2xl rounded-b-lg">
          <p className="text-white text-xl md:text-2xl mb-2 text-cente">
            Services
          </p>
          <div className="flex justify-center items-center  overflow-x-auto gap-x-4 text-white text-[1rem] animate-scroll">
            {[...services, ...services].map((item, index) => (
              <div
                key={index}
                className="bg-orange-100 p-2 rounded-lg text-[#240F2E] whitespace-nowrap"
              >
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
