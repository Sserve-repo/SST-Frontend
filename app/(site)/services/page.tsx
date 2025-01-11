import React, { Suspense } from "react";
import ServiceAvailability from "./ServiceAvailability";

const Service = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full min-h-screen">
      <ServiceAvailability />
      </div>
    </Suspense>
  );
};

export default Service;
