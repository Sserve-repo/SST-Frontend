import React from "react";
import Image from "next/image";
import FooterImg from "../../assets/images/footerShape.png";
import Search from "../../assets/icons/search.svg";
import FooterItems from "./FooterItems";

const Footer = () => {
  return (
    <div className="flex flex-col relative bg-white h-screen  w-full ">
      <div className="flex flex-col justify-center items-center  text-[#502266] gap-y-8 mb-36">
        <Image src={FooterImg} alt="shape" />

        <div className="absolute w-full pt-32 flex items-center justify-center">
          <div className="flex items-center justify-between h-40 bg-white px-20 rounded-lg w-[80%] text-[25px] text-black shadow ">
            <div className="flex flex-col">
              <p>Subscribe to our </p>
              <p>Newsletters</p>
            </div>

            {/* Search Input and Button */}
            <div className="relative w-[30rem] shadow-2xl">
              <div className=" flex items-center w-full rounded-2xl">
                <input
                  placeholder="Enter your email..."
                  className="w-full h-[4rem] text-xl rounded-2xl pl-12 text-black ring-1 ring-black"
                />
                <button className="absolute text-white flex items-center justify-center gap-x-2 bg-black rounded-lg text-xl h-[3rem] px-3 right-2 top-1/2 transform -translate-y-1/2">
                  <Image src={Search} alt="search-icon" />
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterItems />
    </div>
  );
};

export default Footer;
