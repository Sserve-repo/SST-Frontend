import React from "react";
import Image from "next/image";
import People from "../../assets/images/many.png";
import { Button } from "../ui/button";

const Section7 = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row  justify-center items-center  mt-20 px-[6rem] w-full ">
      <div className="lg:flex-1/2 flex flex-col items-center  lg:items-start  text-[#502266] lg:gap-y-8 mx-2 ">
        <section className="hidden lg:block lg:text-[40px] font-bold">
          <p> Ready to get started with </p>
          <p> your next project?</p>
        </section>
        <section className="lg:hidden text-[1.4rem] text-center font-bold whitespace-nowrap ">
          <p> Ready to get started with your </p>
          <p> next project?</p>
        </section>
        <p>Find the perfect Artisans & Vendors near you!</p>

        <Button className="text-[22px] px-4 py-2 my-8 text-white bg-[#502266] rounded-2xl  text-center ">
          Join SphereServe
        </Button>
      </div>

      <Image className="hidden lg:block object-cover" src={People} alt="many" />
    </div>
  );
};

export default Section7;
