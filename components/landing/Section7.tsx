"use client";
import React from "react";
import Image from "next/image";
import People from "../../assets/images/many.png";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Section7 = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-center items-center mt-10 md:mt-16 lg:mt-20 px-6 md:px-12 lg:px-24 w-full">
      <div className="lg:flex-1 flex flex-col items-center lg:items-start text-[#502266] gap-y-4 lg:gap-y-8 mx-2 text-center lg:text-left">
        {/* Large Screen Text */}
        <section className="hidden lg:block text-[2.5rem] font-bold leading-tight">
          <p>Ready to get started with</p>
          <p>your next project?</p>
        </section>

        {/* Small & Medium Screen Text */}
        <section className="lg:hidden text-[1.4rem] sm:text-[2rem] font-bold whitespace-nowrap leading-snug">
          <p>Ready to get started with</p>
          <p>your next project?</p>
        </section>

        <p className="sm:text-[1rem] text-sm md:text-[1.25rem]">
          Find the perfect Artisans & Vendors near you!
        </p>

        <Button
          className="sm:text-[1rem] md:text-[1.4rem] px-4 py-3 sm:my-6 md:my-8 text-white bg-[#502266] rounded-2xl"
          onClick={() => router.push("/auth/register")}
        >
          Join SphereServe
        </Button>
      </div>

      {/* Image Section */}
      <div className="w-full lg:w-auto">
        <Image
          className="hidden lg:block object-cover"
          src={People}
          alt="many"
        />
      </div>
    </div>
  );
};

export default Section7;
