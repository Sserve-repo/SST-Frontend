import React from "react";
import Splash from "./_components/splash";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="grid grid-cols-1 lg:grid-cols-12 w-full h-screen">
        <div className="hidden lg:col-span-5 lg:block h-full overflow-hidden">
          <Splash />
        </div>
        <div className="col-span-12 lg:col-span-7 overflow-auto">
          {children}
        </div>
      </main>
    </>
  );
}
