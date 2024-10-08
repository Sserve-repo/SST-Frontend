import React from "react";
import Image from "next/image";
import verifiedIcon from "../../assets/images/verifiedIcon.svg";
import People from "../../assets/images/many.png";
import { Button } from "../ui/button";

const Section7 = () => {
  return (
    <div className="grid grid-cols-2  justify-center items-center   mt-20 px-[6rem] border ">
      <div className="flex flex-col  items-start  text-[#502266] gap-y-8 mt-auto">
        <section className="text-[40px] font-bold">
          <p> Ready to get started with </p>
          <p> your next project?</p>
        </section>
        <p>Find the perfect Artisans & Vendors near you!</p>

        <Button className="py-2 my-8 text-white bg-[#502266] rounded w-[14rem] text-center hover:cursor-pointer">
          Join SphereServe
        </Button>
      </div>
      <div className="flex justify-center items-center   border">
        <Image
          className=" "
          src={People}
          layout="responsive"
          width={500}
          height={300}
          alt="many"
        />
      </div>
    </div>
  );
};

export default Section7;
