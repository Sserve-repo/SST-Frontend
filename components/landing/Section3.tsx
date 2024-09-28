import React from "react";
import Image from "next/image";
import Tailor from "../../assets/images/tailor.png";

const Section3 = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-white pt-10  min-h-screen px-[6rem] ">
      <h1 className="text-[40px] text-[#502266] font-semibold">
        Recommended Artisans
      </h1>
      <div className="grid grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
          return (
            <div className="border h-[20rem] w-[18rem]  rounded-lg" key={index}>
              <div className="grid grid-rows-2 h-[50%] overflow-hidden">
                <div className="">
                  {/* <p>Adebayo Craftsman</p> */}
                  <Image className="rounded-lg" src={Tailor} alt="tailor" />
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
