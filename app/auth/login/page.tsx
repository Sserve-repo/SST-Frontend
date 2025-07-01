"use client";

import React, { Suspense } from "react";
import LoginForm from "./_components/LoginForm";
import { Splash } from "../_components/splash";

const RegisterPage = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex items-center justify-center w-full min-h-screen ">
          <div className="hidden lg:col-span-5 lg:block h-full overflow-hidden">
            <Splash />
          </div>
          <div className="container mx-auto p-4 justify-center w-full items-center flex flex-col">
            <LoginForm />
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default RegisterPage;
