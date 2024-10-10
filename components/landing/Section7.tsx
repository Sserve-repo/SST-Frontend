import React from "react";
import Image from "next/image";
import People from "../../assets/images/many.png";
import { Button } from "../ui/button";

const Section7 = () => {
  return (
    <div className="flex  justify-center items-center  mt-20 px-[6rem]  ">
      <div className="flex-1/2 items-start  text-[#502266] gap-y-8 ">
        <section className="text-[40px] font-bold">
          <p> Ready to get started with </p>
          <p> your next project?</p>
        </section>
        <p>Find the perfect Artisans & Vendors near you!</p>

        <Button className="text-[22px] px-4 py-2 my-8 text-white bg-[#502266] rounded-2xl  text-center hover:cursor-pointer">
          Join SphereServe
        </Button>
      </div>

      <Image className="object-cover" src={People} alt="many" />
    </div>
  );
};

export default Section7;
