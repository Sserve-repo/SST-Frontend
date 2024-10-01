import React from "react";
import Splash from "./_components/splash";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="transition-all w-full duration-500 flex justify-center items-center">
        <div className="w-6/12 hidden lg:block">
          <Splash />
        </div>
        <div className=" w-full lg:w-7/12">{children}</div>
      </main>
    </>
  );
}
