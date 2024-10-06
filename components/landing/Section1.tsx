import React from "react";

const Section1 = () => {
  const products = [
    "Cuisines",
    "Fashion and textiles",
    "Home Decor",
    "Art and craft",
    "Jewelry and accessories",
    "Herbal & wellness products",
  ];

  const services = [
    "Beauty & Fashion",
    "Event Services",
    "Mechanical & Technical Services",
    "Custom Crafting",
    "Cultural & Educational Services",
    "Home Services/Improvement",
  ];
  return (
    <div className="w-full grid grid-cols-1 bg-white pt-10 h-[60rem]  border-2 border-red-700">
      <div className="flex flex-col w-full justify-center items-center  absolute py-2 text-start text-white text-[55px] rounded">
        <div className=" bg-[#FFB46A] flex flex-col py-4 w-full  justify-center items-center text-2xl">
          <p className="text-[#502266]">Products</p>

          <div className="flex justify-center  items-center gap-x-4 text-white text-[1rem] ">
            {products.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-orange-100 p-2 rounded-lg text-[#240F2E]"
                >
                  <p>{item}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#9E4FC4] flex flex-col py-4 w-full  justify-center items-center text-2xl">
          <p className="text-white">Services</p>
          <div className="flex justify-center  items-center gap-x-4 text-white text-[1rem] ">
            {services.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-orange-100 p-2 rounded-lg text-[#240F2E]"
                >
                  <p>{item}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1;
