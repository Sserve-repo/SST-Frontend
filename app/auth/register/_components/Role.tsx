"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VendorForm } from "./VendorForm";
import { BuyerForm } from "./BuyerForm";
import { ArtisanForm } from "./ArtisanForm";
import { FiBriefcase, FiUser } from "react-icons/fi";
import { IconType } from "react-icons";
import { useSearchParams } from "next/navigation";
import {
  Splash,
  ArtisanSplash,
  BuyerSplash,
  VendorSplash,
} from "../../_components/splash";

type Role = "artisan" | "vendor" | "buyer";

export default function Role() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const searchParams = useSearchParams();

  const role = searchParams.get("role");
  const step = searchParams.get("step");

  const renderForm = () => {
    switch (selectedRole) {
      case "artisan":
        return (
          <div className="flex w-full h-screen overflow-hidden">
            <div className="hidden w-1/2 lg:col-span-5 lg:block h-full ">
              <ArtisanSplash />
            </div>
            <div className="w-1/2 container mx-auto p-4 justify-center items-center flex flex-col ">
              <ArtisanForm
                registrationStep={parseInt(step ?? "1")}
                onBack={() => setSelectedRole(null)}
              />
            </div>
          </div>
        );
      case "vendor":
        return (
          <div className="flex w-full h-screen overflow-hidden">
            <div className="hidden w-1/2 lg:col-span-5 lg:block h-full">
              <VendorSplash />
            </div>
            <div className="w-1/2 container mx-auto p-4 justify-center items-center flex flex-col">
              <VendorForm
                registrationStep={parseInt(step ?? "1")}
                onBack={() => setSelectedRole(null)}
              />
            </div>
          </div>
        );
      case "buyer":
        return (
          <div className="flex w-full h-screen overflow-hidden">
            <div className="hidden w-1/2 lg:col-span-5 lg:block h-full">
              <BuyerSplash />
            </div>
            <div className="w-1/2 container mx-auto p-4 justify-center items-center flex flex-col">
              <BuyerForm onBack={() => setSelectedRole(null)} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (role === "vendor" || role === "artisan" || role === "buyer") {
      setSelectedRole(role as Role);
    }
  }, [role]);

  const roleIcons: Record<Role, IconType> = {
    artisan: FiUser,
    vendor: FiBriefcase,
    buyer: FiBriefcase,
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {selectedRole ? (
        renderForm()
      ) : (
        <div className="flex w-full">
          <div className="hidden  w-1/2 lg:col-span-5 lg:block h-full overflow-hidden">
            <Splash />
          </div>
          <div className="w-1/2 container mx-auto p-4 justify-center  items-center flex flex-col">
            <div className=" max-w-md">
              <div className="flex justify-center items-center w-full">
                <div className="text-left">
                  <h1 className="text-5xl font-bold text-primary mb-2">
                    Join Us!
                  </h1>
                  <p className="text-lg font-medium text-gray-400">
                    To begin this journey, tell us what type of account
                    you&apos;d be opening.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 w-full my-8">
                {(["artisan", "vendor", "buyer"] as const).map((role) => (
                  <Card
                    key={role}
                    className="cursor-pointer hover:shadow-lg transition-all bg-white hover:bg-primary group"
                    onClick={() => setSelectedRole(role)}
                  >
                    <CardHeader className="flex p-5 items-center flex-row gap-4">
                      <div className="p-3 rounded-full border border-primary group-hover:border-white transition-colors">
                        {React.createElement(roleIcons[role], {
                          className:
                            "text-2xl text-primary group-hover:text-white",
                        })}
                      </div>
                      <div>
                        <CardTitle className="capitalize text-lg text-gray-800 group-hover:text-white">
                          {role}
                        </CardTitle>
                        <CardDescription className="text-gray-700 text-sm group-hover:text-white">
                          Lorem ipsum dolor sit amet consectetur. Nisl ut duis
                          mollis. {role}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <div className="flex items-center w-full text-gray-400 mt-4">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="font-semibold text-primary ml-1 hover:underline"
                >
                  Log In
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* </div> */}
    </Suspense>
  );
}
