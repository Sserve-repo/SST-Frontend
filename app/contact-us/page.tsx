import React from "react";
import Image from "next/image";
import HeroBg from "../../assets/images/contact-us.png";

const ContactUs = () => {
  return (
    <div className="relative grid grid-cols-1 bg-white min-h-screen w-full">
      {/* Background Image */}
      <Image className="" src={HeroBg} alt="property" />

      {/* Main Content Section */}
      <div className="absolute flex flex-col py-2 mt-40 text-start text-[55px] w-full">
        {/* Text Content */}
        <div className="flex flex-col ml-44 text-start pl-[5rem]">
          <div className="font-bold flex flex-col text-white  text-[55px]">
            <p>Contact Us</p>
          </div>

          {/* Search Input and Button */}
          <div className=" w-[46rem] mt-14 h-auto">
            <div className="flex flex-col bg-white w-[30rem] gap-y-6 py-4 rounded-2xl text-gray-600">
              <p className=" text-xl text-start mx-6 text-[#502266] font-semibold">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <div className="flex flex-col justify-center items-start w-full text-sm px-6 text-start gap-y-1">
                <p className="text-gray-300 text-[1rem]">
                  Full Name (First Name, Last Name)
                </p>
                <input
                  placeholder="Enter your fullname"
                  className="w-full h-[3rem] bg-gray-300  rounded-2xl pl-12 ring-1 ring-gray-300"
                />
              </div>
              <div className=" flex flex-col justify-center items-start w-full text-sm px-6 text-start gap-y-1">
                <p className="text-gray-300 text-[1rem]">Email</p>
                <input
                  placeholder="Enter your email address"
                  className="w-full h-[3rem] bg-gray-300  rounded-2xl pl-12 ring-1 ring-gray-300"
                />
              </div>
              <div className=" flex flex-col justify-center items-start w-full text-sm px-6 text-start gap-y-1">
                <p className="text-gray-300 text-[1rem]">Subject</p>
                <input
                  placeholder="Enter the subject of your message"
                  className="w-full h-[3rem] bg-gray-300  rounded-2xl pl-12 ring-1 ring-gray-300"
                />
              </div>

              <div className=" flex flex-col justify-center items-start w-full text-sm px-6 text-start gap-y-1">
                <p className="text-gray-300 text-[1rem]">Message</p>
                <textarea
                  placeholder="Enter your message here"
                  className="w-full h-[8rem] bg-gray-300  rounded-2xl pl-12 ring-1 ring-gray-300"
                />
              </div>
              <button className="text-center bg-[#502266] rounded-lg text-white text-xl h-[3rem] mx-6">
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
