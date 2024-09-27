import React from "react";
import Image from "next/image";
import verifiedIcon from "../../assets/images/verifiedIcon.svg";
import Many from "../../assets/images/many.png";

const Section7 = () => {
  return (
    <div className="grid grid-cols-2 bg-white mt-32 pt-32 min-h-screen px-[6rem] font-primaryFont">
      <div className="flex flex-col justify-center items-start  text-[#502266] gap-y-8 ">
        <div className="text-[40px] font-extrabold">
          <p>Ready to get started with </p>
          <p>your next project?</p>
        </div>
        <div>Find the perfect Artisans & Vendors near you!</div>

        <p className="py-2 my-8 text-white bg-[#502266] rounded w-[14rem] text-center hover:cursor-pointer">
          Join SphereServe
        </p>
      </div>
      <div className=" mt-auto">
        <Image className="relative" src={Many} alt="property" />
      </div>
    </div>
  );
};

export default Section7;
