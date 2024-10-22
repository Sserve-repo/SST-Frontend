"use client";

import Image from "next/image";
import React from "react";

type SuccessProps = {
  email: string;
};

export function Success({ email }: SuccessProps) {
  return (
    <div className="max-w-lg mx-auto w-full relative">
      <div className="flex flex-col items-center  text-center gap-y-6 text-[#502266]">
        <Image
          className=" object-cover "
          src="/assets/icons/inbox.svg"
          alt="inbox"
          width={80}
          height={80}
        />

        <p className="text-3xl font-semibold">Check your inbox</p>
        <div className="text-center">
          <p>We’ve just sent an email confirmation to</p>
          <p>
            <span className="font-bold">{email}, </span>click the link to verify
            your email.
          </p>
        </div>
      </div>
    </div>
  );
}
