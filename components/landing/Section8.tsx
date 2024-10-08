import React from "react";
import Image from "next/image";
import Referrer from "../../assets/images/referrer.svg";

const Section8 = () => {
  return (
    <div className="grid grid-cols-3  relative bg-[#70358b]  py-16 px-[6rem]">
      <div className="flex flex-col justify-center items-start  text-[#502266] gap-y-8 col-span-2">
        <div className="text-[40px]  text-white ">
          <p className="text-white font-bold">
            Refer a friend and get rewards!
          </p>
          <div className="text-[1.7rem]">
            <p>Share SphereServes with your friends, and </p>
            <p>earn rewards when they sign up and make</p>
            <p> their first purchase.</p>
          </div>
        </div>

        <p className="text-[28px]  p-2 my-8  text-[#502266] bg-white rounded-xl text-center hover:cursor-pointer">
          Get Your Referral Link
        </p>
      </div>
      <div className=" ml-auto ">
        <Image className="relative" src={Referrer} alt="property" />
      </div>
    </div>
  );
};

export default Section8;
