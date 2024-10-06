import React from "react";
import Image from "next/image";
import verifiedIcon from "../../assets/images/verifiedIcon.svg";
import Property from "../../assets/images/property.png";

const Section7 = () => {
  const Items = [
    "Quality Guaranteed",
    "Direct Access to Trusted Experts",
    "Seamless & Secure Transactions",
    "Fair Pricing & Transparent Deals",
    "Tailored Solutions for Every Need",
    "Ongoing Support & Assistance",
  ];
  return (
    <div className="grid grid-cols-2   mt-20 min-h-screen px-[6rem]  ">
      <div className="flex flex-col justify-start items-start  text-[#502266] gap-y-8 mt-auto">
        <h1 className="text-[40px] font-bold">Get More with SphereServe</h1>
        <div>
          {Items.map((item, index) => {
            return (
              <div className="flex gap-x-4" key={index}>
                <Image src={verifiedIcon} alt="verifiedIcon"></Image>
                <p className="text-[25px] ">{item}</p>
              </div>
            );
          })}
        </div>

        <p className="py-2 my-8 text-white bg-[#502266] rounded w-[14rem] text-center hover:cursor-pointer">
          Get Started
        </p>
      </div>
      <div className=" mt-auto">
        <Image className="relative" src={Property} alt="property" />
      </div>
    </div>
  );
};

export default Section7;
