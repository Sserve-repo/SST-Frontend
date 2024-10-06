import React from "react";
import Image from "next/image";
import Cement from "../../assets/images/cement.png";
import plusIcon from "../../assets/icons/plusIcon.svg";

const Section6 = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-white pt-36 mt-36  min-h-screen px-[6rem]">
      <h1 className="text-[40px] text-[#502266] font-semibold">
        Featured Products
      </h1>
      <div className="border-2 border-slate-800 w-full  rounded-2xl  p-7 ">
        <div className="grid lg:grid-cols-4 grid-cols-2  gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
            return (
              <div
                className=" h-[23rem] w-[18rem]  rounded-lg rounded-b-none"
                key={index}
              >
                <div className="grid grid-rows-2 overflow-hidden rounded-t-lg">
                  <Image
                    className="rounded-t-lg h-[13rem]"
                    src={Cement}
                    alt="tailor"
                  />

                  <div className="flex flex-col px-2 font-semibold pt-2 bg-[#FF9F3F]  h-[10rem] rounded-b-lg overflow-hidden gap-y-1 justify-center items-start">
                    <p className="text-[18px] text-black">
                      Triple Rock - Plaster of Paris(POP)
                    </p>
                    <div className="flex text-[10px] gap-x-2 text-black">
                      <p className=" rounded-lg p-1 bg-[#f4c391]">Home Decor</p>
                      <p className=" rounded-lg p-1 bg-[#f4c391]">
                        House Decoration
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-x-6">
                      <p className="p-2 rounded-2xl text-white w-[6rem] border border-white">
                        $2,999.99
                      </p>
                      <div className="flex justify-center items-center gap-x-2  w-[9rem] p-3 rounded-2xl bg-white">
                        <Image
                          className="rounded-t-lg h-5"
                          src={plusIcon}
                          alt="plusIcon"
                        />

                        <p className="text-sm text-black hover:cursor-pointer text-center">
                          Add to Cart
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center w-full pt-10">
          <p className="bg-[#502266] px-4 py-2 ml-[30rem] text-white rounded-lg">
            Next Page
          </p>
          <div className="flex gap-x-6 ml-auto">
            <p className="  py-2 rounded-lg "> Page </p>
            <input type="number" className="w-[6rem] outline-2 outline-black" />
            <p className="  py-2 rounded-lg "> 100 </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section6;
