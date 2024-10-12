import React from "react";
import Image from "next/image";
import Referrer from "../../assets/images/referrer.svg";
import { Button } from "../ui/button";

const Section9 = () => {
  return (
    <section className="relative py-12 md:py-24 lg:py-32 overflow-hidden">
      <Image
        className="absolute inset-0 object-cover w-full h-full"
        src="/assets/images/Frame.png?height=1080&width=1920"
        alt="background"
        width={1920}
        height={1080}
      />
      <div className="relative container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="text-center lg:text-left mb-8 lg:mb-0 lg:mr-8 ">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Refer a friend and get rewards!
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-lg mb-6">
              Share SphereServes with your friends, and earn rewards when they
              sign up and make their first purchase.
            </p>
            <Button
              size="lg"
              className="bg-white text-[#502266] hover:bg-white/90"
            >
              Get Your Referral Link
            </Button>
          </div>
          <div className="hidden lg:block">
            <Image src={Referrer} alt="Referrer" width={400} height={400} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section9;
