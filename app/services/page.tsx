import React, { Suspense } from "react";
import ServicePage from "./ServicePage";

const Service = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServicePage />
    </Suspense>
  );
};

export default Service;
