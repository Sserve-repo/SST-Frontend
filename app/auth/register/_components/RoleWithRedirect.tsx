"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiBriefcase, FiUser } from "react-icons/fi";
import { IconType } from "react-icons";
import Link from "next/link";
import React from "react";

type Role = "artisan" | "vendor" | "buyer";

export default function Role() {
  const roleIcons: Record<Role, IconType> = {
    artisan: FiUser,
    vendor: FiBriefcase,
    buyer: FiBriefcase,
  };

  return (
    <div className="container mx-auto p-4 justify-center w-full items-center flex flex-col">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center w-full">
          <div className="text-left">
            <h1 className="text-[55px] font-bold text-primary">Join Us!</h1>
            <p className="text-[25px] font-normal text-[#502266]">
              To begin this journey, tell us what type of account you&apos;d be
              opening.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 w-full my-8">
          {(["artisan", "vendor", "buyer"] as const).map((role) => (
            <Link href={`/auth/register?role=${role}`} key={role}>
              <Card className="cursor-pointer hover:shadow-lg transition-all bg-white hover:bg-primary group">
                <CardHeader className="flex p-5 items-center flex-row gap-4">
                  <div className="p-3 rounded-full border-2 border-primary group-hover:border-white transition-colors">
                    {React.createElement(roleIcons[role], {
                      className: "text-2xl text-primary group-hover:text-white",
                    })}
                  </div>
                  <div>
                    <CardTitle className="capitalize text-lg font-bold text-[#240F2E] group-hover:text-white">
                      {role}
                    </CardTitle>
                    <CardDescription className="text-[#502266] text-sm font-normal group-hover:text-white">
                      Lorem ipsum dolor sit amet consectetur. Nisl ut duis
                      mollis. {role}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <div className="flex items-center w-full text-[#b9b9b9] font-normal text-lg mt-4">
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
  );
}
