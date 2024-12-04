import React, { Suspense } from "react";
import ServiceAvailability from "./ServiceAvailability";

const Service = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceAvailability />
    </Suspense>
  );
};

export default Service;
