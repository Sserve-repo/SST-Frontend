import React from "react";

const FooterItems = () => {
  const join = ["Artisans", "Vendors", "Shoppers"];
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
  const aboutUs = ["SphereServes Inc", "Policies", "ShereServes blog"];
  const help = ["Help Center", "Piracy Policy", "Contact Us"];

  return (
    <div className="flex  bg-white justify-center items-center mt-26 pt-26  lg:w-[80%] lg:mx-40 text-[#502266]">
      <div className="grid sm:grid-cols-1 lg:grid-cols-5 w-full gap-6 justify-center ">
        <div>
          <p className="font-bold my-2">Join</p>
          {join.map((item, index) => {
            return (
              <div key={index}>
                <p className="hover:cursor-pointer p-1">{item}</p>
              </div>
            );
          })}
        </div>
        <div>
          <p className="font-bold my-2">Services</p>
          {services.map((item, index) => {
            return (
              <div key={index}>
                <p className="hover:cursor-pointer p-1">{item}</p>
              </div>
            );
          })}
        </div>
        <div>
          {" "}
          <p className="font-bold my-2">Products</p>
          {products.map((item, index) => {
            return (
              <div key={index}>
                <p className="hover:cursor-pointer p-1">{item}</p>
              </div>
            );
          })}
        </div>
        <div>
          {" "}
          <p className="font-bold my-2">About Us</p>
          {aboutUs.map((item, index) => {
            return (
              <div key={index}>
                <p className="hover:cursor-pointer p-1">{item}</p>
              </div>
            );
          })}
        </div>
        <div>
          {" "}
          <p className="font-bold my-2">Help</p>
          {help.map((item, index) => {
            return (
              <div key={index}>
                <p className="hover:cursor-pointer p-1">{item}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FooterItems;
