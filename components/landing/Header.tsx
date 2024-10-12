"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
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
    <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
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
                      {Object.entries(products).map(([category, items]) => (
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
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center space-x-5">
              <Link
                href="/refer-earn"
                className="hidden sm:flex text-sm items-center space-x-2"
              >
                {/* <AiFillGift className="h-4 w-4" /> */}
                <span>Refer & Earn</span>
              </Link>
              <Link
                href="/favorites"
                className="text-gray-600 hover:text-gray-900"
              >
                <Heart className="h-6 w-6" />
              </Link>
              <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                <ShoppingCart className="h-6 w-6" />
              </Link>
            </div>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" className="border-[#FFB46A]" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Join SphereServer</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Role 1</DropdownMenuItem>
                <DropdownMenuItem>Role 2</DropdownMenuItem>
                <DropdownMenuItem>Role 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    variant="outline"
                    className="border-[#FFB46A]"
                    asChild
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>Join SphereServer</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Role 1</DropdownMenuItem>
                      <DropdownMenuItem>Role 2</DropdownMenuItem>
                      <DropdownMenuItem>Role 3</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
