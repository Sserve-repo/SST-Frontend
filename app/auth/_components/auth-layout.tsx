import { ReactNode, Suspense } from "react";
import { Splash } from "./splash";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center w-full min-h-screen ">
        <div className="hidden lg:col-span-5 lg:block h-full overflow-hidden">
          <Splash />
        </div>
        <div className="container mx-auto p-4 justify-center w-full items-center flex flex-col">
          {children}
        </div>
      </div>
    </Suspense>
  );
}
