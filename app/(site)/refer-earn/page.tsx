import React, { Suspense } from "react";


const ReferGain = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full min-h-screen">
        </div>
    </Suspense>
  );
};

export default ReferGain;
