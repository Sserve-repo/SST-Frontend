import React, { Suspense } from "react";
import ProductPage from "./ProductPage";

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPage />
    </Suspense>
  );
};

export default LoginPage;
