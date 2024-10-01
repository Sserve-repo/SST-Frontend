import React from "react";
import Image from "next/image";
import Logo from "../../assets/images/logo.svg";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const products = {
    African: [
      "African Foodstuffs",
      "Fashion & Textiles",
      "Home Décor & Furniture",
      "Art & Craft",
      "Jewelry & Accessories",
      "Herbal Products",
    ],
    Asian: [
      "Cuisines (foodstuffs)",
      "Fashion & Textiles",
      "Home Décor",
      "Art & Craft",
      "Jewelry & Accessories",
      "Herbal Products",
    ],
    Indian: [
      "Cuisines (foodstuffs)",
      "Fashion & Textiles",
      "Home Décor",
      "Art & Craft",
      "Jewelry & Accessories",
      "Herbal Products",
    ],
    Caribbean: [
      "Cuisines (foodstuffs)",
      "Fashion & Textiles",
      "Home Décor",
      "Art & Craft",
      "Jewelry & Accessories",
      "Herbal Products",
    ],
    European: [
      "Cuisines (foodstuffs)",
      "Fashion & Textiles",
      "Home Décor",
      "Art & Craft",
      "Jewelry & Accessories",
      "Herbal Products",
    ],
  };

  const services = {
    "Home Services/Improvement": [
      "Home Care",
      "Landscaping",
      "House Decoration",
      "Construction",
    ],
    "Custom Crafting": ["Custom Handmade Crafting", "Craft Workshops"],
    "Beauty & Fashion": [
      "Salon Services",
      "Fashion Design",
      "Makeup & Massage",
    ],
    "Mechanical & Technical": [
      "Auto Mechanics",
      "Detailing",
      "Technical (Handyman, Carpentry, Plumbing)",
      "Electrical",
    ],
    "Event Services": ["Event Planning", "Catering Services"],
    "Cultural & Educational": [
      "Tour Guide Services",
      "Photography & Videography",
      "Language Translation Services",
    ],
  };

  return (
    <div
      className="fixed top-0 left-0 bg-white h-28 w-full z-50 items-center border px-20 text-[#240F2E] shadow-lg"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "16px",
      }}
    >
      {" "}
      {/* Background Image */}
      <div className="flex justify-between mr-auto ">
        <Link href="/">
          <Image className="" src={Logo} alt="property" />
        </Link>
      </div>
      <div className="flex gap-x-8 ">
        <NavigationMenu>
          <NavigationMenuList>
            {/* Services */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-[1rem]">
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[35rem] h-[34rem] grid grid-cols-2 p-4">
                  <div className="flex flex-col">
                    <p className="py-2 font-bold">Home Services/Improvement</p>
                    {services["Home Services/Improvement"].map(
                      (item: string, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            <Link
                              href={"/"}
                              className="hover:cursor-pointer my-1"
                            >
                              {item}
                            </Link>
                          </React.Fragment>
                        );
                      }
                    )}
                  </div>

                  <div className="flex flex-col">
                    <p className="py-2 font-bold">Custom Crafting</p>
                    {services["Custom Crafting"].map(
                      (item: string, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            <Link
                              href={"/"}
                              className="hover:cursor-pointer my-1"
                            >
                              {item}
                            </Link>
                          </React.Fragment>
                        );
                      }
                    )}
                  </div>

                  <div className="flex flex-col">
                    <p className="py-2 font-bold">Beauty & Fashion</p>
                    {services["Beauty & Fashion"].map(
                      (item: string, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            <Link
                              href={"/"}
                              className="hover:cursor-pointer my-1"
                            >
                              {item}
                            </Link>
                          </React.Fragment>
                        );
                      }
                    )}
                  </div>

                  <div className="flex flex-col">
                    <p className="py-2 font-bold">Mechanical & Technical</p>
                    {services["Mechanical & Technical"].map(
                      (item: string, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            <Link
                              href={"/"}
                              className="hover:cursor-pointer my-1"
                            >
                              {item}
                            </Link>
                          </React.Fragment>
                        );
                      }
                    )}
                  </div>

                  <div className="flex flex-col">
                    <p className="py-2 font-bold">Event Services</p>
                    {services["Event Services"].map(
                      (item: string, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            <Link
                              href={"/"}
                              className="hover:cursor-pointer my-1"
                            >
                              {item}
                            </Link>
                          </React.Fragment>
                        );
                      }
                    )}
                  </div>

                  <div className="flex flex-col">
                    <p className="py-2 font-bold">Cultural & Educational</p>
                    {services["Cultural & Educational"].map(
                      (item: string, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            <Link
                              href={"/"}
                              className="hover:cursor-pointer my-1"
                            >
                              {item}
                            </Link>
                          </React.Fragment>
                        );
                      }
                    )}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Products */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-[1rem]">
                Products
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[35rem] h-[48rem] grid grid-cols-2 p-4">
                  <div className="flex flex-col">
                    <p className="py-2 font-bold">African</p>
                    {products.African.map((item: string, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          <Link
                            href={"/"}
                            className="hover:cursor-pointer my-1"
                          >
                            {item}
                          </Link>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <p className="py-2 font-bold">Asian</p>
                    {products.Asian.map((item: string, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          <Link
                            href={"/"}
                            className="hover:cursor-pointer my-1"
                          >
                            {item}
                          </Link>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <p className="py-2 font-bold">Indian</p>
                    {products.Indian.map((item: string, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          <Link
                            href={"/"}
                            className="hover:cursor-pointer my-1"
                          >
                            {item}
                          </Link>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <p className="py-2 font-bold">Caribbean</p>
                    {products.Caribbean.map((item: string, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          <Link
                            href={"/"}
                            className="hover:cursor-pointer my-1"
                          >
                            {item}
                          </Link>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <p className="py-2 font-bold">European</p>
                    {products.European.map((item: string, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          <Link
                            href={"/"}
                            className="hover:cursor-pointer my-1"
                          >
                            {item}
                          </Link>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/contact-us">
                <p className="text-[1rem] hover:cursor-pointer">Contact Us</p>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex justify-between ml-auto items-center gap-x-4">
        <Link href={"/auth/login"}>Login</Link>
        <Link href={"/auth/register"}>Register</Link>
        <Link href={"/auth/register"}>
          <p className="bg-[#502266] px-6 py-2 text-white rounded-lg hover:cursor-pointer">
            Join SphereServer
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Header;
