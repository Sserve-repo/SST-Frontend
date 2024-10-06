"use client";

import React, { useState } from "react";
import Image from "next/image";
import Tailor from "../../assets/images/tailor.png";
import BeforeLike from "../../assets/icons/beforeLike.png";
import AfterLike from "../../assets/icons/afterLike.svg";

const Section3 = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col justify-center items-center bg-white pt-10  min-h-screen px-[6rem] ">
      <h1 className="text-[25px] lg:text-[40px]  text-[#502266] font-semibold">
        Recommended Artisans
      </h1>
      <div className=" grid lg:grid-cols-4 grid-cols-2 gap-2 sm:gap-x-8  w-full ">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
          return (
            <div
              className="border h-[20rem]    lg:w-[18rem]  rounded-lg overflow-hidden"
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative  grid grid-rows-2 h-[50%] overflow-hidden">
                <div className=" h-full">
                  <Image className="rounded-lg " src={Tailor} alt="tailor" />
                  {hoveredIndex === index && (
                    <div className="absolute flex flex-col items-center justify-center h-50 w-50 bg-white rounded-full top-10 right-3">
                      <Image
                        className="rounded-lg h-5 w-5 m-2"
                        src={AfterLike || BeforeLike}
                        alt="favorite"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col pl-6 font-semibold gap-y-2">
                <p className="text-[18px]">Adebayo Craftsman</p>
                <div className="flex gap-2 text-[9.3px]">
                  <p className="bg-[#D3AFE4] rounded-lg p-1">Capentry</p>
                  <p className="bg-[#D3AFE4] rounded-lg p-1">Funiture Design</p>
                </div>
                <p>⭐ (3.5/5.0)</p>
                <div className="p-2 bg-[#FF7F00] rounded-lg text-white w-[6rem] hover:cursor-pointer">
                  Hire Now!
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Section3;
