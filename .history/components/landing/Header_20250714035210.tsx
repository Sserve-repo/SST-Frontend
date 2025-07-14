"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RoleWithRedirect from "@/app/auth/register/_components/RoleWithRedirect";
import CartIcon from "../CartIcon";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserType } from "@/config/utils";

export default function Header() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, currentUser, logOut } = useAuth();

  const handleOpenRole = () => {
    if (!isAuthenticated) {
      setModalOpen(!isModalOpen);
    } else {
      console.log(currentUser.user_type)
      const type = getUserType(currentUser.user_type);
      // router.push(`/${type}/dashboard`);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAuth = () => {
    console.log({ isAuthenticated });
    if (isAuthenticated) {
      logOut();
    } else {
      router.push("/auth/login");
    }
  };

  // Close all popovers when modal opens
  const closeAllPopovers = () => {
    setIsServicesOpen(false);
    setIsProductsOpen(false);
  };

  // Prevent body scroll when modal is open and close popovers
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      closeAllPopovers();
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset body overflow
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-40">
        <div className="relative container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <Image
                src="/assets/images/logo.svg"
                alt="Logo"
                width={220}
                height={60}
                className="h-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Services Popover */}
            <Link
              href={"/services"}
              className="text-gray-700 hover:text-[#502266] transition-colors font-medium flex items-center gap-1"
            >
              Services
            </Link>

            <Link
              href={"/products"}
              className="text-gray-700 hover:text-[#502266] transition-colors font-medium flex items-center gap-1"
            >
              Products
            </Link>

            {/* Additional Navigation Items */}
            <div className="flex items-center space-x-4">
              <Link
                href="/favorites"
                className="text-gray-600 hover:text-[#502266] transition-colors"
                title="Favorites"
              >
                <div className="flex gap-x-2">
                  <Heart className="h-6 w-6" />
                  Favorites
                </div>
              </Link>
              <Link href={"/cart"}>
                <div className="flex gap-x-2">
                  <CartIcon />
                  Carts
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              className="border border-[#FFB46A] bg-white text-black hover:bg-[#FFB46A] hover:text-white transition-colors"
              onClick={handleAuth}
              variant="outline"
              disabled={isModalOpen}
            >
              {isAuthenticated ? "Logout" : "Login"}
            </Button>

            <Button
              onClick={handleOpenRole}
              className="bg-[#502266] hover:bg-[#502266]/90 text-white"
              disabled={isModalOpen}
            >
              {isAuthenticated ? "Dashboard" : "Join SphereServe"}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                disabled={isModalOpen}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col space-y-8">
                <Link href="/" className="flex justify-center">
                  <Image
                    src="/assets/images/logo.svg"
                    alt="Logo"
                    width={180}
                    height={50}
                    className="h-auto"
                  />
                </Link>

                <div className="flex flex-col space-y-6 text-gray-700">
                  <Link
                    href="/services"
                    className="hover:text-[#502266] transition-colors font-medium"
                  >
                    Services
                  </Link>
                  <Link
                    href="/products"
                    className="hover:text-[#502266] transition-colors font-medium"
                  >
                    Products
                  </Link>
                  <Link
                    href="/refer-earn"
                    className="hover:text-[#502266] transition-colors font-medium"
                  >
                    Refer & Earn
                  </Link>
                  <Link
                    href="/favorites"
                    className="hover:text-[#502266] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5" />
                      <span className="font-medium">Favorites</span>
                    </div>
                  </Link>
                  <Link
                    href="/cart"
                    className="hover:text-[#502266] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CartIcon />
                      <span className="font-medium">Cart</span>
                    </div>
                  </Link>
                </div>

                <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleAuth}
                    variant="outline"
                    className="border-[#FFB46A] border-2 text-black hover:bg-[#FFB46A] hover:text-white"
                  >
                    {isAuthenticated ? "Logout" : "Login"}
                  </Button>

                  <Button
                    onClick={handleOpenRole}
                    className="bg-[#502266] text-white hover:bg-[#502266]/90"
                  >
                    {isAuthenticated ? "Dashboard" : "Join SphereServe"}
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Custom Backdrop for Navigation Popovers */}
      {(isServicesOpen || isProductsOpen) && !isModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeAllPopovers}
        />
      )}

      {/* Modal with Proper Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Content */}
              <div className="p-6">
                <RoleWithRedirect />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
