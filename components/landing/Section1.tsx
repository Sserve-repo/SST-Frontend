import React from "react";
import Image from "next/image";
import Hero from "../../assets/images/hero.png";

const Section1 = () => {
  return (
    <div className="grid grid-cols-1 bg-white pt-10 min-h-screen  font-primaryFont">
      {/* <div className="flex flex-col justify-start items-start  text-[#502266] gap-y-8 mt-auto"> */}
        <Image className="relative" src={Hero} alt="property" />

        {/* <p className="py-2 my-8 text-white bg-[#502266] rounded w-[14rem] text-center hover:cursor-pointer">
          Get Started
        </p> */}
      {/* </div> */}
      <div className=" mt-auto"></div>
    </div>
  );
};

export default Section1;
