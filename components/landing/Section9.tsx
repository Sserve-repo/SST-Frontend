import React from "react";
import Image from "next/image";
import Referrer from "../../assets/images/referrer.svg";

const Section9 = () => {
  return (
    <div className="relative flex flex-col  py-16 px-[6rem] h-screen">
      <Image
        className="absolute inset-0 object-cover w-full h-full"
        src="/assets/images/Frame.png?height=1080&width=1920"
        alt="background"
        width={1920}
        height={1080}
      />

      <div className="absolute top-[18rem]  grid grid-cols-3 justify-center items-center  text-[#502266] gap-y-8 ">
        <div className="flex flex-col col-span-2  ">
          <p className="text-[40px] text-white font-bold">
            Refer a friend and get rewards!
          </p>
          <div className="text-[1.5rem]  text-white ">
            <p>Share SphereServes with your friends, and </p>
            <p>earn rewards when they sign up and make</p>
            <p> their first purchase.</p>
            <button className="text-[24px]  p-2 my-8  text-[#502266] bg-white rounded-xl text-center hover:cursor-pointer">
              Get Your Referral Link
            </button>
          </div>
        </div>

        <div className="ml-auto ">
          <Image className="" src={Referrer} alt="property" />
        </div>
      </div>
    </div>
  );
};

export default Section9;
