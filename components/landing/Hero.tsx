import React from "react";
import Image from "next/image";
import HeroBg from "../../assets/images/hero.png";
import Search from "../../assets/icons/search.svg";

const Hero = () => {
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
    <div className="relative grid grid-cols-1 min-h-screen w-full">
      {/* Background Image */}
      <Image className="w-full inset-0" src={HeroBg} alt="property" />

      {/* Main Content Section */}
      <div className="absolute flex flex-col py-2 mt-40 text-start text-white text-[55px] w-full">
        {/* Text Content */}
        <div className="flex flex-col pl-44 text-start text-white text-[55px]">
          <p className="text-2xl my-4">Welcome, AgboCity</p>
          <div className="font-bold flex flex-col space-y-0">
            <p>Find trusted Vendors</p>
            <p>& Artisans for your</p>
            <p>needs.</p>
          </div>
          <p className="text-[#FFDFC0] text-[25px]">
            Get quality products & services—all in one place.
          </p>

          {/* Search Input and Button */}
          <div className="relative w-[60rem] mt-14">
            <div className=" flex items-center w-full">
              <input
                placeholder="I am looking for..."
                className="w-full h-[5rem] text-xl rounded-lg pl-12 text-black"
              />
              <button className="absolute flex items-center justify-center gap-x-2 bg-black rounded-lg text-2xl h-[4rem] px-3 right-2 top-1/2 transform -translate-y-1/2">
                <Image src={Search} alt="search-icon" />
                Search
              </button>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="lg:hidden mt-[7rem] flex ml-[18rem] items-center gap-x-4 text-white text-xl">
            {metrics.map((metric, index) => {
              return (
                <>
                  <div key={index}>
                    <p>{metric.counts}</p>
                    <p className="text-[#E97400]">{metric.desc}</p>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0  flex flex-col w-full justify-center items-center px-2 pt-[7rem] text-start text-white text-[55px] mt-auto">
        {/* Products Section */}
        <div className="bg-[#FFB46A] flex flex-col py-4 justify-center items-center text-2xl">
          <p className="text-[#502266]">Products</p>
          <div className="flex justify-center items-center gap-x-4 text-white text-[1rem] animate-scroll-reverse">
            {[...products, ...products].map((item, index) => (
              <div
                key={index}
                className="bg-orange-100 p-2 rounded-lg text-[#240F2E]"
              >
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-[#9E4FC4] flex flex-col py-4 justify-center items-center text-2xl rounded-b-lg">
          <p className="text-white">Services</p>
          <div className="flex justify-center items-center gap-x-4 text-white text-[1rem] animate-scroll">
            {[...services, ...services].map((item, index) => (
              <div
                key={index}
                className="bg-orange-100 p-2 rounded-lg text-[#240F2E]"
              >
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
