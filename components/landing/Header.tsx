"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RoleWithRedirect from "@/app/auth/register/_components/RoleWithRedirect";
import CartIcon from "../CartIcon";
import { useRouter } from "next/navigation";
import { getProductMenu } from "@/fetchers/product";

export default function Header() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [productsMenu, setProductsMenu] = useState<any[]>([]);
  const router = useRouter();

  const handleOpenRole = () => {
    setModalOpen(!isModalOpen);
  };

  // const products = {
  //   African: [
  //     "African Foodstuffs",
  //     "Fashion & Textiles",
  //     "Home Décor & Furniture",
  //     "Art & Craft",
  //     "Jewelry & Accessories",
  //     "Herbal Products",
  //   ],
  //   Asian: [
  //     "Cuisines (foodstuffs)",
  //     "Fashion & Textiles",
  //     "Home Décor",
  //     "Art & Craft",
  //     "Jewelry & Accessories",
  //     "Herbal Products",
  //   ],
  //   Indian: [
  //     "Cuisines (foodstuffs)",
  //     "Fashion & Textiles",
  //     "Home Décor",
  //     "Art & Craft",
  //     "Jewelry & Accessories",
  //     "Herbal Products",
  //   ],
  //   Caribbean: [
  //     "Cuisines (foodstuffs)",
  //     "Fashion & Textiles",
  //     "Home Décor",
  //     "Art & Craft",
  //     "Jewelry & Accessories",
  //     "Herbal Products",
  //   ],
  //   European: [
  //     "Cuisines (foodstuffs)",
  //     "Fashion & Textiles",
  //     "Home Décor",
  //     "Art & Craft",
  //     "Jewelry & Accessories",
  //     "Herbal Products",
  //   ],
  // };

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

  const handleAuth = () => {
    if (isAuth) {
      localStorage.removeItem("accessToken");
      setIsAuth(false);
    } else {
      router.push("/auth/login");
    }
  };

  const handleFetchProductMenu = async () => {
    const response = await getProductMenu();
    if (response && response.ok) {
      const data = await response.json();
      setProductsMenu(data.data["Products Category Menu"]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuth(true);
    }

    handleFetchProductMenu();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="relative container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <Image
              src="/assets/images/logo.svg"
              alt="Logo"
              width={220}
              height={60}
            />
          </Link>
        </div>
        <div className="">
          <nav className="hidden lg:flex space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[35rem] max-h-[80vh] overflow-y-auto grid grid-cols-2 p-4">
                      {Object.entries(services).map(([category, items]) => (
                        <div key={category} className="flex flex-col mb-4">
                          <p className="font-bold mb-2">{category}</p>
                          {items.map((item, index) => (
                            <Link
                              key={index}
                              href="/"
                              className="hover:underline mb-1"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[35rem] max-h-[80vh] overflow-y-auto grid grid-cols-2 p-4">
                      {productsMenu.map((category) => (
                        <div
                          key={`${category.name}${category.id}`}
                          className="flex flex-col mb-4"
                        >
                          <p className="font-bold mb-2">{category.name}</p>
                          {category["product_categories"].map((item, index) => (
                            <Link
                              key={index}
                              href={`/products/?categoryId=${item.id}`}
                              // href={`/products/?categoryId=${item["product_category_id"]}`}
                              className="hover:underline mb-1"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center space-x-5">
              <Link
                href="/refer-earn"
                className="hidden sm:flex text-sm items-center space-x-2"
              >
                <span>Refer & Earn</span>
              </Link>
              <Link
                href="/favorites"
                className="text-gray-600 hover:text-gray-900"
              >
                <Heart className="h-6 w-6" />
              </Link>
              <CartIcon />
            </div>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <Button
              className="border border-[#FFB46A] bg-white text-black hover:text-white"
              onClick={() => handleAuth()}
              // variant="outline"
              // asChild
            >
              {isAuth ? "Logout" : "Login"}
            </Button>
            <Button onClick={handleOpenRole}>Join SphereServe</Button>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col space-y-12">
              <Link href="/" className="mr-4">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Logo"
                  width={220}
                  height={60}
                />
              </Link>
              <div className="flex flex-col space-y-6 mt-6">
                <Link href="/services">Services</Link>
                <Link href="/products">Products</Link>
                <Link href="/refer-earn">Refer & Earn</Link>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => handleAuth()}
                  variant="outline"
                  className="border-[#FFB46A]"
                  asChild
                >
                  {isAuth ? "Logout" : "Login"}
                </Button>
                <Button onClick={handleOpenRole}>Join SphereServer</Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Framer Motion Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={handleOpenRole}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white w-[90%] max-w-lg rounded-lg p-2 relative shadow-lg"
            >
              <button
                onClick={handleOpenRole}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-3 bg-white">
                <RoleWithRedirect />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
