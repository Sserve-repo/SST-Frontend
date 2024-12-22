import React, { Suspense } from "react";
import Role from "./_components/Role";

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center w-full min-h-screen flex-col">
        <Role />
      </div>
    </Suspense>
  );
};

export default LoginPage;
