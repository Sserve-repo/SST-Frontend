"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export function Success() {
  const router = useRouter();
  return (
    <div className="max-w-lg mx-auto w-full relative">
      <div className="flex flex-col items-center  text-center gap-y-6 text-[#502266]">
        <p className="text-3xl font-semibold">Congratulations 🎉</p>
        <div className="text-center">
          <p>Account setup completed</p>
          <Button onClick={() => router.push("/dashboard")}>Continue</Button>
        </div>
      </div>
    </div>
  );
}
