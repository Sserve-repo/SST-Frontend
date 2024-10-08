"use client";

import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";

export default function Hero() {
  const metrics = [
    {
      counts: "137,673",
      desc: "Freelance Artisans",
    },
    {
      counts: "5 - 60+",
      desc: "Crafts per project",
    },
    {
      counts: "47,321",
      desc: "Completed Crafts",
    },
  ];

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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        className="absolute inset-0 object-cover w-full h-full"
        src="/assets/images/hero.png?height=1080&width=1920"
        alt="background"
        width={1920}
        height={1080}
      />

      {/* Main Content Section */}
      <div className="relative z-10 flex flex-col w-full min-h-screen">
        <div className="flex-grow container flex min-h-screen item-center w-full mx-auto px-4 py-48 lg:pt-64">
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

            {/* Metrics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white text-center sm:text-left">
              {metrics.map((metric, index) => (
                <div key={index}>
                  <p className="text-2xl font-bold">{metric.counts}</p>
                  <p className="text-[#E97400]">{metric.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products and Services Section */}
        <div className="mt-auto w-full">
          {/* Products Section */}
          <div className="bg-[#FFB46A] py-4 w-full">
            <div className="container mx-auto px-4 w-full">
              <p className="text-[#502266] text-xl md:text-2xl mb-2 text-center">
                Products
              </p>
              <div className="flex justify-center w-full items-center overflow-x-auto gap-4 pb-2">
                {products.map((item, index) => (
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
          <div className="bg-[#9E4FC4] py-4 w-full rounded-b-lg">
            <div className="container w-full mx-auto px-4">
              <p className="text-white text-xl md:text-2xl mb-2 text-center">
                Services
              </p>
              <div className="flex justify-center w-full items-center overflow-x-auto gap-4 pb-2">
                {services.map((item, index) => (
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
      </div>
    </div>
  );
}
