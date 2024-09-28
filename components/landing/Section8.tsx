"use client";

import React, { useState } from "react";
import Image from "next/image";
import Show from "../../assets/icons/plus.svg";
import Hide from "../../assets/icons/minus.svg";
import Circus from "../../assets/images/vector.png";

const Section8 = () => {
  const [openCard, setOpenCard] = useState(null);

  const toggleCard = (cardIndex: any) => {
    // If the clicked card is already open, close it; otherwise, open the clicked card and close others
    setOpenCard(openCard === cardIndex ? null : cardIndex);
  };

  return (
    <div className="flex flex-col bg-white mt-32 pt-32 min-h-screen px-[6rem]">
      <div
        className={`h-[36rem]  py-12 bg-[#F7F0FA] w-full flex flex-col items-center justify-start`}
      >
        <p className="pb-4 text-[#502266] text-[2.5rem] font-bold">
          What is SphereServe?
        </p>

        <div className="grid grid-cols-2 w-full gap-6 px-6">
          {/* Item1 */}
          <div
            className={`bg-white h-auto rounded-lg flex flex-col px-6 py-4 drop-shadow-lg`}
          >
            <div
              className={`flex items-center ${openCard === 1 && "h-26"} ${
                openCard !== 1 && "h-auto pt-4"
              }`}
            >
              <p className="font-bold">Why is SphereServe the best?</p>
              {openCard === 1 ? (
                <div
                  className="bg-[#FF7F00] inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(1)}
                >
                  <Image src={Hide} alt="Show Icon" />
                </div>
              ) : (
                <div
                  className="bg-black inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(1)}
                >
                  <Image src={Show} alt="" />
                </div>
              )}
            </div>
            {openCard === 1 && (
              <p className="pt-4 mr-[4rem] text-start">
                Ut enim ad minim veniam quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat aute irure dolor
              </p>
            )}
          </div>

          {/* Item2 */}
          <div className="bg-white h-auto rounded-lg flex flex-col px-6 py-4 drop-shadow-lg">
            <div
              className={`flex items-center ${openCard === 2 && "h-26"} ${
                openCard !== 2 && "h-auto pt-4"
              }`}
            >
              <p className="font-bold">How to launch a join as an artisan?</p>
              {openCard === 2 ? (
                <div
                  className="bg-[#FF7F00] inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(2)}
                >
                  <Image src={Hide} alt="Show Icon" />
                </div>
              ) : (
                <div
                  className="bg-black inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(2)}
                >
                  <Image src={Show} alt="" />
                </div>
              )}
            </div>
            {openCard === 2 && (
              <p className="pt-4 mr-[4rem] text-start">
                Ut enim ad minim veniam quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat aute irure dolor
              </p>
            )}
          </div>

          {/* Item3 */}
          <div className="bg-white h-auto rounded-lg flex flex-col px-6 py-4 drop-shadow-lg">
            <div
              className={`flex items-center ${openCard === 3 && "h-26"} ${
                openCard !== 3 && "h-auto pt-4"
              }`}
            >
              <p className="font-bold">When was SphereServe Inc founded?</p>
              {openCard === 3 ? (
                <div
                  className="bg-[#FF7F00] inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(3)}
                >
                  <Image src={Hide} alt="Show Icon" />
                </div>
              ) : (
                <div
                  className="bg-black inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(3)}
                >
                  <Image src={Show} alt="" />
                </div>
              )}
            </div>
            {openCard === 3 && (
              <p className="pt-4 mr-[4rem] text-start">
                Ut enim ad minim veniam quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat aute irure dolor
              </p>
            )}
          </div>

          {/* Item4 */}
          <div className="bg-white h-auto rounded-lg flex flex-col px-6 py-4 drop-shadow-lg">
            <div
              className={`flex items-center ${openCard === 4 && "h-26"} ${
                openCard !== 4 && "h-auto pt-4"
              }`}
            >
              <p className="font-bold">Who founded SphereServe Inc?</p>
              {openCard === 4 ? (
                <div
                  className="bg-[#FF7F00] inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(4)}
                >
                  <Image src={Hide} alt="Show Icon" />
                </div>
              ) : (
                <div
                  className="bg-black inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(4)}
                >
                  <Image src={Show} alt="" />
                </div>
              )}
            </div>
            {openCard === 4 && (
              <p className="pt-4 mr-[4rem] text-start">
                Ut enim ad minim veniam quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat aute irure dolor
              </p>
            )}
          </div>

          {/* Item5 */}
          <div className="bg-white h-auto rounded-lg flex flex-col px-6 py-4 drop-shadow-lg">
            <div
              className={`flex items-center ${openCard === 5 && "h-26"} ${
                openCard !== 5 && "h-auto pt-4"
              }`}
            >
              <p className="font-bold">Is SphereServe the future of work?</p>
              {openCard === 5 ? (
                <div
                  className="bg-[#FF7F00] inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(5)}
                >
                  <Image src={Hide} alt="Show Icon" />
                </div>
              ) : (
                <div
                  className="bg-black inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(5)}
                >
                  <Image src={Show} alt="" />
                </div>
              )}
            </div>
            {openCard === 5 && (
              <p className="pt-4 mr-[4rem] text-start">
                Ut enim ad minim veniam quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat aute irure dolor
              </p>
            )}
          </div>

          {/* Item6 */}
          <div className="bg-white h-auto rounded-lg flex flex-col px-6 py-4 drop-shadow-lg">
            <div
              className={`flex items-center ${openCard === 6 && "h-26"} ${
                openCard !== 6 && "h-auto pt-4"
              }`}
            >
              <p className="font-bold">Who are the founders?</p>
              {openCard === 6 ? (
                <div
                  className="bg-[#FF7F00] inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(6)}
                >
                  <Image src={Hide} alt="Show Icon" />
                </div>
              ) : (
                <div
                  className="bg-black inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
                  onClick={() => toggleCard(6)}
                >
                  <Image src={Show} alt="" />
                </div>
              )}
            </div>
            {openCard === 6 && (
              <p className="pt-4 mr-[4rem] text-start">
                Ut enim ad minim veniam quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat aute irure dolor
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-[10rem]">
        <p className="text-[36px] text-[#240F2E] font-bold my-4">
          What Our Clients Say About Us
        </p>
        <div className="relative">
          <Image src={Circus} alt="" />
          <div className="absolute">
            <div className=" bg-white shadow-2xl border rounded-2xl h-[314px] w-[682px]"></div>
            <div className=" bg-white shadow-2xl border rounded-2xl h-[342px] w-[650px]"></div>
            {/* <div className=" bg-white shadow-2xl border rounded-2xl h-[362px] w-[612px]"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section8;
