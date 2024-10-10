import React from "react";
import Image from "next/image";
import Referrer from "../../assets/images/referrer.svg";
import { Button } from "../ui/button";

const Section9 = () => {
  return (
    <div className="relative flex flex-col  lg:py-16 lg:px-[6rem] h-80 lg:min-h-screen">
      <Image
        className="absolute inset-0 object-cover w-full h-full"
        src="/assets/images/Frame.png?height=1080&width=1920"
        alt="background"
        width={1920}
        height={1080}
      />

      <div className="absolute lg:top-[18rem] top-[6rem]  flex flex-col lg:grid lg:grid-cols-3 justify-center items-center  text-[#502266] lg:gap-y-8 ">
        <div className="flex flex-col col-span-2  justify-center  sm:items-center lg:items-start gap-y-4">
          <p className="text-[1.4rem] lg:text-[40px] text-white font-bold whitespace-nowrap">
            Refer a friend and get rewards!
          </p>
          <div className="text-center lg:text-start text-[1rem] lg:text-[1.5rem]  text-white inline-flex flex-col gap-y-4 h-auto ">
            <div>
              <p>Share SphereServes with your friends, and </p>
              <p>earn rewards when they sign up and make</p>
              <p> their first purchase.</p>
            </div>
            <Button className="text-[1.2rem]  lg:text-[24px] py-4 lg:my-8  text-[#502266] bg-white rounded-xl text-center lg:inline-flex">
              Get Your Referral Link
            </Button>
          </div>
        </div>

        <div className="hidden lg:block ml-auto ">
          <Image className="" src={Referrer} alt="property" />
        </div>
      </div>
    </div>
  );
};

export default Section9;
