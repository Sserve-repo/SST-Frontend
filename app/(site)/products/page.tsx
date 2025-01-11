import React, { Suspense } from "react";
import ProductPage from "./ProductPage";

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full min-h-screen">
      <ProductPage />
      </div>
    </Suspense>
  );
};

export default LoginPage;
