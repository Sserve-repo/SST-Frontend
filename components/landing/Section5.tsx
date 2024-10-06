import React from "react";

const Section5 = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-white pt-36  min-h-screen px-[6rem]">
      <h1 className="text-[40px] text-[#502266] font-semibold">
        Featured Services
      </h1>
      <div className="border-2 border-slate-800 w-full  rounded-2xl  p-7 ">
        <div className="grid lg:grid-cols-4 grid-cols-2  gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
            return (
              <div
                className=" h-[23rem] w-[18rem]  rounded-lg rounded-b-none"
                key={index}
              >
                <div className="grid grid-rows-2 overflow-hidden bg-white rounded-t-lg">
                  <div className="border h-13"></div>
                  {/* <Image
                  className="rounded-t-lg h-[13rem]"
                  src={Tailor}
                  alt="tailor"
                /> */}

                  <div className="flex flex-col px-2 font-semibold pt-2 bg-[#240F2E]  h-[10rem] rounded-b-lg overflow-hidden">
                    <p className="text-[18px] text-[#FF7F00]">
                      Wooden Sculpture - (African Elephant).
                    </p>
                    <p className="text-[13px] text-white rounded-lg p-1 bg-[#F7F0FA] bg-opacity-60 w-[6rem]">
                      Home Decor
                    </p>
                    <div className="flex justify-between items-center px-2 text-white">
                      <p className="text-sm">⭐⭐⭐⭐ (3.5/5.0)</p>
                      <p className="p-2 bg-white rounded-2xl text-black w-[6rem] hover:cursor-pointer">
                        Book Now
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center w-full">
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

export default Section5;
